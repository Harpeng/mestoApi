import { Router } from 'express';
import {
  getCurrentUser,
  getUser,
  getUserById,
  updateUser,
  updateUserAvatar,
} from '../controlers/users';
import { validateUpdateAvatar, validateUpdateUser, validateUser } from '../middlewares/validation';

const userRouter = Router();

userRouter.get('/', getUser);

userRouter.get('/:userId', validateUser, getUserById);

userRouter.patch('/me', validateUpdateUser, updateUser);

userRouter.get('/me', getCurrentUser);

userRouter.patch('/me/avatar', validateUpdateAvatar, updateUserAvatar);

export default userRouter;
