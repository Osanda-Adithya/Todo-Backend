import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import createHttpError, { isHttpError } from "http-errors";
import userRoutes from "./routes/user";
import taskRoute from "./routes/task";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({ origin: "*", credentials: true, allowedHeaders: ["set-cookie"] })
);

app.use("/api/user", userRoutes);

app.use("/api/tasks", taskRoute);

app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  let errorMessage = "An unkown error occured";
  let statusCode = 500;
  if (isHttpError(error)) {
    errorMessage = error.message.toString();
    statusCode = error.statusCode;
  }
  res.status(statusCode).json({ error: errorMessage });
});

export default app;
