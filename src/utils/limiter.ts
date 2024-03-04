// eslint-disable-next-line import/no-extraneous-dependencies
import { rateLimit } from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: 'Слишком много запросов с данного IP, попробуйте позже',
});

export default limiter;
