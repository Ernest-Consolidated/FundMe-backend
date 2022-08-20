import { Express, Request, Response } from "express";

function routes(app: Express) {
  // Performance and healthcheck
  app.get("/healthcheck", (req: Request, res: Response) => {
    res.sendStatus(200);
  });

  app.get("/", (req: Request, res: Response) => {
    res.send("Running Background task...⌛");
  });

  // Create User route
  //   app.post("/api/donate", createUserHandler);
}

export default routes;
