let fsp = require("fs/promises");
let path = require("path");
var UrlPattern = require("url-pattern");
let redirects = require("./redirects");

for (let redirect of redirects) {
  redirect.sourcePattern = new UrlPattern(redirect.source);
  redirect.destinationPattern = new UrlPattern(redirect.destination);
}

function resolve(p) {
  return path.resolve(__dirname, p);
}

function getContentType(ext) {
  switch (ext.toLowerCase()) {
    case ".css":
      return "text/css";
    case ".js":
      return "text/javascript";
  }

  return null;
}

module.exports = {
  handleRedirect: function (path) {
    const redirect = this.getRedirect(path);
    if(!redirect) {
        return null;
    }

    return {
      status: redirect.permanent ? 301 : 302,
      body: "Redirecting to: " + redirect.url,
      headers: {
        Location: redirect.url,
      },
    };
  },
  handleStatic: async function (base, url) {
    const file = await fsp.readFile(resolve(base + url.path), "utf8");

    const ext = path.extname(url.path);
    return {
      status: 200,
      body: file,
      headers: {
        "Content-Type": getContentType(ext),
      },
    };
  },
  getRedirect: function (url) {
    for (let redirect of redirects) {
      const match = redirect.sourcePattern.match(url);
      if (match) {
        return {
          url: redirect.destinationPattern.stringify(match),
          permanent: redirect.permanent,
        };
      }
    }

    return null;
  },
  handleReact: async function (renderAsync, url, pathToIndexHtml, transformAsync) {
    let result = await renderAsync(url);

    if(!result.headers["Content-Type"]){
        result.headers["Content-Type"] = "text/html"; 
    };

    let body = result.body;
    const json = JSON.stringify(result.data || {});

    if (url.query.__serverside) {
      body = json;
      result.headers["Content-Type"] = "application/json";
    } else if (result.html) {
      body = await fsp.readFile(
        pathToIndexHtml,
        "utf8"
      );

 
      if(transformAsync){
        body = await transformAsync(body);
      }
 

      body = body.replace("<!--app-html-->", result.html);

      let data = result.data ? `<script>window.__serverside = ${json};</script>` : "";
      body = body.replace("<!--app-data-->", data);
    }

    return {
      status: result.status,
      body: body,
      headers: result.headers,
    };
  },
};


