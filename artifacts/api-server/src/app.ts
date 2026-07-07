import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import { logger } from "./lib/logger.js";

const app = express();

app.use((req, res, next) => {
  req.log = logger.child({
    method: req.method,
    url: req.url.split("?")[0],
  });
  res.on("finish", () => {
    req.log?.info({ statusCode: res.statusCode }, "request completed");
  });
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
