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
      render = require(path.resolve(__dirname, "../dist/server/entry.server.js")).render;
      result = await common.handleReact(render, url, "./dist/client");
    }
  } 

  context.res = {
    status: result.status,
    body: result.body,
    headers: result.headers
  };
};