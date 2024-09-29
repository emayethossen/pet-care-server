import express, { Application, Request, Response } from "express";
import cors from "cors";
import { UserRoutes } from "./app/modules/user/user.route";
import { PostRoutes } from "./app/modules/post/post.route";

import {
  errorHandler,
  notFoundHandler,
} from "./app/middlewares/error.middleware";
import bodyParser from "body-parser";

const app: Application = express();

// parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
// app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// application routes
app.use("/api", UserRoutes);
app.use("/api", PostRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// Not Found handler
app.use(notFoundHandler);

// Error Handler
app.use(errorHandler);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: "Not Found",
  });
});

export default app;
