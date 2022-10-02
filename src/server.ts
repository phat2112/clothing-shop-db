import { config } from "dotenv";
import express, { Application, Response } from "express";
import mongoose from "mongoose";

config();

// connect database
async function main() {
  await mongoose.connect(
    "mongodb+srv://phatnguyen:phatnguyen@cluster0.wkyst.mongodb.net/shop-clothing?retryWrites=true&w=majority"
  );
}

main()
  .then(() => {
    console.log("database connected");
    startServer();
  })
  .catch(console.log);

const app: Application = express();

const startServer = () => {
  app.get("/", (_, res: Response) => {
    res.send("Hello world");
  });

  const port = process.env.PORT || 8000;
  app.listen(port, () => console.log(`Server is running from port ${port}`));
};
