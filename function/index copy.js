let path = require("path");
let fsp = require("fs/promises");
var URL = require("url");
var UrlPattern = require('url-pattern');

const redirects = [
    {
      source: '/test/syndicates-and-shares/:slug',
      destination: '/buy/syndicates-and-shares/:slug', 
      permanent: true,
    },
    {
      source: '/old-url/:var1/:var2',
      destination: '/new-url/:var2/:var1', 
      permanent: true,
    }
];

 
for(let redirect of redirects) {
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

module.exports = async function (context, req) {
  var url = URL.parse(req.url, true);

  const redirect = getRedirect(url.path);

  if(redirect){
    handleRedirect(context, redirect);
  } else if (url.pathname.toLowerCase().startsWith("/assets/")) {
    await handleStatic(context, url);
  } else {
    await handleReact(context, url);
  }
};

async function handleStatic(context, url) {
  const file = await fsp.readFile(
    resolve("../dist/client" + url.pathname),
    "utf8"
  );

  const ext = path.extname(url.pathname);
  context.res = {
    status: 200,
    body: file,
    headers: {
      "Content-Type": getContentType(ext),
    },
  };
}

function handleRedirect(context, redirect){
    context.res = {
        status: redirect.permanent ? 301 : 302,
        body: "Redirecting to: " + redirect.url,
        headers: {
            'Location': redirect.url
        },
      };
}

async function handleReact(context, url) {
  // Get the render function
  render = require(resolve("../dist/server/entry.server.js")).render;

  let result = await render({
    path: url.pathname,
    url: url.path,
    query: url.query,
  });

  let contentType = "text/html";
  let body = result.body;
  const json = JSON.stringify(result.data || {});

  if (url.query.getData) {
    body = json;
    contentType = "application/json";
  } else if(result.html) {
    const template = await fsp.readFile(
      resolve("../dist/client/index.html"),
      "utf8"
    );

    body = template.replace("<!--app-html-->", result.html);

    let data = result.data
      ? `<script>window.__data = ${json};</script>`
      : "";
    body = body.replace("<!--app-data-->", data);
  }

  context.res = {
    status: result.status,
    body: body,
    headers: {
      "Content-Type": contentType,
    },
  };
}


function getRedirect(url){
    for(let redirect of redirects) {
        const match = redirect.sourcePattern.match(url); 
        if(match){
            return {
                url: redirect.destinationPattern.stringify(match),
                permanent: redirect.permanent
            };
        }
    }

    return null;
}