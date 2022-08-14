let path = require("path");
let URL = require("url");
let common = require('../server-common');

module.exports = async function (context, req) {
  var parsed = URL.parse(req.url, true);

  const url = {
    path: parsed.pathname,
    url: parsed.path,
    query: parsed.query,
  };

  // Check for redirect first
  let result = common.handleRedirect(url.path);

  if(!result){
    if (url.path.toLowerCase().startsWith("/assets/")) {
      result = await common.handleStatic("./dist/client", url);
    } else {
      render = (await import("../dist/server/entry.server.mjs")).render;
      result = await common.handleReact(render, url, path.resolve(__dirname, "../dist/client/index.html"));
    }
  } 

  context.res = {
    status: result.status,
    body: result.body,
    headers: result.headers
  };
};