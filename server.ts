import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors()
);

mongoose
  .connect(process.env.uri || "", {})
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err: Error) => console.error("MongoDB connection error:", err));

import postRoutes from "./routes/posts";
import categoryRoutes from "./routes/category";
import analyticsRoutes from "./routes/analytics";
import authRoutes from "./routes/auth";

app.use("/posts", postRoutes);
app.use("/category", categoryRoutes);
app.use("/analysis", analyticsRoutes);
app.use("/auth", authRoutes);
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, welcome to the blog API!');
});

const PORT: number = Number(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
