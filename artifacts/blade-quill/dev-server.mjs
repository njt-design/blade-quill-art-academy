import { createServer } from "http";
import { createProxyMiddleware } from "http-proxy-middleware";
import express from "express";

const PORT = Number(process.env.PORT) || 3000;
const VITE_PORT = 3001;
const TINA_PORT = 4001;
const TINA_HOST = "[::1]";

const app = express();

const tinaProxyOpts = {
  target: `http://${TINA_HOST}:${TINA_PORT}`,
  changeOrigin: true,
  ws: true,
  on: {
    error: (err, req, res) => {
      if (res && typeof res.status === "function") {
        res.status(502).send("TinaCMS server not available: " + err.message);
      }
    },
  },
};

const viteProxyOpts = {
  target: `http://localhost:${VITE_PORT}`,
  changeOrigin: true,
  ws: true,
  on: {
    error: (err, req, res) => {
      if (res && typeof res.status === "function") {
        res.status(502).send("Vite server not available: " + err.message);
      }
    },
  },
};

const tinaProxy = createProxyMiddleware(tinaProxyOpts);
const viteProxy = createProxyMiddleware(viteProxyOpts);

app.use("/admin", (req, res, next) => {
  req.url = "/admin" + req.url;
  tinaProxy(req, res, next);
});

app.use("/graphql", (req, res, next) => {
  req.url = "/graphql" + (req.url === "/" ? "" : req.url);
  tinaProxy(req, res, next);
});

app.use(viteProxy);

const server = createServer(app);

server.on("upgrade", (req, socket, head) => {
  if (req.url?.startsWith("/admin") || req.url?.startsWith("/graphql")) {
    tinaProxy.upgrade(req, socket, head);
  } else {
    viteProxy.upgrade(req, socket, head);
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Dev proxy server running on port ${PORT}`);
  console.log(`  -> /admin and /graphql proxied to TinaCMS on port ${TINA_PORT}`);
  console.log(`  -> everything else proxied to Vite on port ${VITE_PORT}`);
});
