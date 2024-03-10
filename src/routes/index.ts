import {
  NextFunction,
  Request,
  Response,
  Router,
} from 'express';
import userRouter from './users';
import cardRouter from './cards';
import NotFoundError from '../errors/not-found-error';
import { notFoundError } from '../constants/messages';

const router = Router();
router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError(notFoundError));
});

export default router;
