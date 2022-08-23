import express from "express";
import cors from "cors";
import routes from "../routes";

function creatServer() {
  const app = express();

  app.enable("trust proxy");

  const corsOptions = {
    origin: "*",
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
  };

  app.use(express.json());

  app.use(cors(corsOptions));

  routes(app);

  return app;
}

export default creatServer;
