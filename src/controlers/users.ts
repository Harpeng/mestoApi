import { NextFunction, Request, Response } from 'express';
import { Error, Error as MongooseError } from 'mongoose';
import { constants } from 'http2';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user';
import {
  conflictError,
  notFoundError,
  requestError,
  unauthorized,
} from '../constants/messages';
import { CustomRequest } from '../types/express';
import UnauthorizedError from '../errors/unauthorized-error';
import BadRequestError from '../errors/bad-request-error';
import NotFoundError from '../errors/not-found-error';
import ConflictError from '../errors/conflict-error';

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    return next(err);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .orFail(() => new UnauthorizedError(unauthorized));
    return res.send(user);
  } catch (err) {
    if (err instanceof MongooseError.CastError) {
      return next(new BadRequestError(requestError));
    }
    return next(err);
  }
};

export const getCurrentUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return next(new NotFoundError(notFoundError));
    }
    return res.send(currentUser);
  } catch (err) {
    if (err instanceof MongooseError.CastError) {
      return next(new BadRequestError(requestError));
    }
    return next(err);
  }
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
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
        next(new BadRequestError(requestError));
      }
      if (err instanceof Error && err.message.startsWith('E11000')) {
        next(new ConflictError(conflictError));
      }
      next(err);
    });
};

export const loginUser = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  return User.findOne({ email })
    .select('+password')
    .orFail(() => new UnauthorizedError(unauthorized))
    .then((user) => {
      bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return new UnauthorizedError(unauthorized);
        }

        const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
          expiresIn: '7d',
        });
        return res.send({ token, name: user.name, email: user.email });
      });
    })
    .catch((err) => {
      if (err instanceof Error && err.name === unauthorized) {
        return next(new UnauthorizedError(unauthorized));
      }
      return next();
    });
};

export const updateUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { name, about } = req.body;
    const userId = req.user?._id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    ).orFail(() => new NotFoundError(notFoundError));
    return res.send(updatedUser);
  } catch (err) {
    if (err instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(requestError));
    }
    if (err instanceof Error && err.name === notFoundError) {
      return next(new NotFoundError(notFoundError));
    }
    return next(err);
  }
};

export const updateUserAvatar = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { avatar } = req.body;
    const userId = req.user?._id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    ).orFail(() => new NotFoundError(notFoundError));
    return res.send(updatedUser);
  } catch (err) {
    if (err instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(requestError));
    }
    if (err instanceof Error && err.name === notFoundError) {
      return next(new NotFoundError(notFoundError));
    }
    return next(err);
  }
};
