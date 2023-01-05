import express, { Application, Response } from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";

import authRoutes from "./routes/authentication";
import productRoutes from "./routes/product";
import Logging from "./library/logging";

config();

// connect database
async function main() {
  await mongoose.connect(
    "mongodb+srv://phatnguyen:phatnguyen@cluster0.wkyst.mongodb.net/shop-clothing?retryWrites=true&w=majority"
  );
}

main()
  .then(() => {
    startServer();
    Logging.info("Mongo connected successfully");
  })
  .catch(console.log);

const app: Application = express();
app.use(express.json());
app.use(cors());

const startServer = () => {
  app.use("/storage", express.static(path.join(__dirname, "../src/public")));

  app.get("/", (_, res: Response) => {
    res.send("Hello world");
  });

  app.use("/auth", authRoutes);

  app.use("/product", productRoutes);

  const port = process.env.PORT || 8000;
  app.listen(port, () => console.log(`Server is running from port ${port}`));
};
