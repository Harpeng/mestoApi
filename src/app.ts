// eslint-disable-next-line import/no-extraneous-dependencies
import express, { json } from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import mongoose from 'mongoose';
// eslint-disable-next-line import/no-extraneous-dependencies
import helmet from 'helmet';
// eslint-disable-next-line import/no-extraneous-dependencies
import { errors } from 'celebrate';
import router from './routes';
import limiter from './utils/limiter';
import { createUser, loginUser } from './controlers/users';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';
import errorsMiddlewares from './middlewares/error';
import { validateCreateUser, validateLogin } from './middlewares/validation';

const { PORT = 3000 } = process.env;

const app = express();

app.use(json());

app.use(requestLogger);

app.use(helmet());

app.use(limiter);

app.post('/signin', validateLogin, loginUser);
app.post('/signup', validateCreateUser, createUser);

app.use(auth);

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(errorsMiddlewares);

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
