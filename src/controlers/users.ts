import { Request, Response } from 'express';
import { Error, Error as MongooseError } from 'mongoose';
import { constants } from 'http2';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user';
import {
  conflictError,
  notFoundError,
  requestError,
  serverError,
  unauthorized,
} from '../constants/messages';
import { CustomRequest } from '../types/express';

export const getUser = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    return res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: serverError });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(() => {
      const error = new Error('Пользователь не найден');
      error.name = notFoundError;
      return error;
    });
    return res.send(user);
  } catch (err) {
    if (err instanceof MongooseError.CastError) {
      return res
        .status(constants.HTTP_STATUS_BAD_REQUEST)
        .send({ message: requestError });
    }
    if (err instanceof Error && err.name === notFoundError) {
      return res
        .status(constants.HTTP_STATUS_NOT_FOUND)
        .send({ message: err.message });
    }
    return res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: serverError });
  }
};

export const getCurrentUser = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const currentUser = await User.findById(userId).orFail(() => {
      const error = new Error('Пользователь не найден');
      error.name = notFoundError;
      return error;
    });
    return res.send(currentUser);
  } catch (err) {
    if (err instanceof MongooseError.ValidationError) {
      return res
        .status(constants.HTTP_STATUS_BAD_REQUEST)
        .send({ message: requestError, err: err.message });
    }
    if (err instanceof Error && err.name === notFoundError) {
      return res
        .status(constants.HTTP_STATUS_NOT_FOUND)
        .send({ message: err.message });
    }
    return res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: serverError });
  }
};

export const createUser = (req: Request, res: Response) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      password: hash,
      email,
    }))
    .then((user) => (
      res.status(constants.HTTP_STATUS_CREATED).send({
        data: {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
          _id: user._id,
        },
      })
    ))
    .catch((err) => {
      if (err instanceof MongooseError.ValidationError) {
        return res
          .status(constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: requestError, err: err.message });
      }
      if (err instanceof Error && err.message.startsWith('E11000')) {
        return res
          .status(constants.HTTP_STATUS_CONFLICT)
          .send({ message: conflictError, err: err.message });
      }
      return res
        .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: serverError });
    });
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  return User.findOne({ email })
    .select('+password')
    .orFail(() => {
      const error = new Error('Неправильная почта или пароль');
      error.name = unauthorized;
      return error;
    })
    .then((user) => {
      bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          const error = new Error('Неправильная почта или пароль');
          error.name = unauthorized;
          return error;
        }

        const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
          expiresIn: '7d',
        });
        return res.send({ token, name: user.name, email: user.email });
      });
    })
    .catch((err) => {
      if (err instanceof Error && err.name === unauthorized) {
        return res
          .status(constants.HTTP_STATUS_UNAUTHORIZED)
          .send({ message: err.message });
      }
      return res
        .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: serverError });
    });
};

export const updateUser = async (req: CustomRequest, res: Response) => {
  try {
    const { name, about } = req.body;
    const userId = req.user?._id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    ).orFail(() => {
      const error = new Error('Пользователь не найден');
      error.name = notFoundError;
      return error;
    });
    return res.send(updatedUser);
  } catch (err) {
    if (err instanceof MongooseError.ValidationError) {
      return res
        .status(constants.HTTP_STATUS_BAD_REQUEST)
        .send({ message: requestError, err: err.message });
    }
    if (err instanceof Error && err.name === notFoundError) {
      return res
        .status(constants.HTTP_STATUS_NOT_FOUND)
        .send({ message: err.message });
    }
    return res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: serverError });
  }
};

export const updateUserAvatar = async (req: CustomRequest, res: Response) => {
  try {
    const { avatar } = req.body;
    const userId = req.user?._id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    ).orFail(() => {
      const error = new Error('Пользователь не найден');
      error.name = notFoundError;
      return error;
    });
    return res.send(updatedUser);
  } catch (err) {
    if (err instanceof MongooseError.ValidationError) {
      return res
        .status(constants.HTTP_STATUS_BAD_REQUEST)
        .send({ message: requestError, err: err.message });
    }
    if (err instanceof Error && err.name === notFoundError) {
      return res
        .status(constants.HTTP_STATUS_NOT_FOUND)
        .send({ message: err.message });
    }
    return res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: serverError });
  }
};
