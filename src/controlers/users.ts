import { Request, Response } from "express";
import User from "../models/user";
import { constants } from "http2";
import {
  notFoundError,
  requestError,
  serverError,
} from "../constants/messages";
import { Error as MongooseError } from "mongoose";

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
      const error = new Error("Пользователь не найден");
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

export const createUser = async (req: Request, res: Response) => {
  try {
    const newUser = new User(req.body);
    return res.status(constants.HTTP_STATUS_CREATED).send(await newUser.save());
  } catch (err) {
    if (err instanceof MongooseError.ValidationError) {
      return res
        .status(constants.HTTP_STATUS_BAD_REQUEST)
        .send({ message: requestError, err: err.message });
    }
    return res
    .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
    .send({ message: serverError });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, about } = req.body;
    const userId = req.user?._id;
    const updatedUser = await User.findByIdAndUpdate(userId, {name, about}, {new: true, runValidators: true}).orFail(() => {
      const error = new Error("Пользователь не найден");
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
    return res
    .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
    .send({ message: serverError });
  }
};

export const updateUserAvatar = async (req: Request, res: Response) => {
  try {
    const { avatar } = req.body;
    const userId = req.user?._id;
    const updatedUser = await User.findByIdAndUpdate(userId, {avatar}, {new: true, runValidators: true}).orFail(() => {
      const error = new Error("Пользователь не найден");
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
    return res
    .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
    .send({ message: serverError });
  }
};
