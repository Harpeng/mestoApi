// eslint-disable-next-line import/no-extraneous-dependencies
import express, {
  NextFunction, Request, Response, json,
} from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import mongoose from 'mongoose';
// eslint-disable-next-line import/no-extraneous-dependencies
import helmet from 'helmet';
import router from './routes';
import limiter from './utils/limiter';

const { PORT = 3000 } = process.env;

const app = express();

app.use(json());

app.use(helmet());

app.use(limiter);

app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '65e0cc132525639f15a1b0eb',
  };

  next();
});

app.use(router);

const connect = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
    console.log('база данных подключена');
    await app.listen(PORT);
    console.log('сервер запущен');
  } catch (err) {
    console.log(err);
  }
};

connect();
