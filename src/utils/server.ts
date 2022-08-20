import express from "express";
import cors from "cors";
import routes from "../routes";

function creatServer() {
  const app = express();

  app.use(cors());

  app.use(express.json());

  routes(app);

  return app;
}

export default creatServer;
