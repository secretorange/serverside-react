let express = require("express");
let common = require("./server-common");
let root = process.cwd();

async function createServer() {
  let app = express();

  let vite = await require("vite").createServer({
    root,
    server: { middlewareMode: "ssr" },
  });

  // Middleware takes care of assets and public folder
  app.use(vite.middlewares);

  app.use("/", async (req, res) => {
    try {
      const url = {
        path: req.path,
        url: req.originalUrl,
        query: req.query,
      };

      // Check for redirect first
      let result = common.handleRedirect(req.path);

      if (!result) {
        let render = await vite
          .ssrLoadModule("src/entry.server.tsx")
          .then((m) => m.render);

        result = await common.handleReact(
          render,
          url,
          "./",
          async (template) => {
            return await vite.transformIndexHtml(url.url, template);
          }
        );
      }

      for (const [key, value] of Object.entries(result.headers)) {
        res.setHeader(key, value);
      }

      return res.status(result.status).end(result.body);
    } catch (error) {
      vite.ssrFixStacktrace(error);

      console.log(error.stack);
      res.status(500).end(error.stack);
    }
  });

  return app;
}

createServer().then((app) => {
  app.listen(3000, () => {
    console.log("HTTP server is running at http://localhost:3000");
  });
});
