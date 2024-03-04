import express, { NextFunction, Request, Response, json } from "express";
import mongoose from "mongoose";
import router from "./routes";
import limiter from "utils/limiter";
import helmet from "helmet";


const { PORT = 3000 } = process.env;

const app = express();

app.use(json());

app.use(helmet());

app.use(limiter);

app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: "65e0cc132525639f15a1b0eb"
  };

  next();
});

app.use(router);


const connect = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
    await app.listen(PORT);
  } catch (err) {
    console.log(err);
  }
};

connect();
