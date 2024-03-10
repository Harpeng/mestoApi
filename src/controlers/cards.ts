import { Request, Response } from 'express';
import { constants } from 'http2';
import { Error as MongooseError, ObjectId } from 'mongoose';
import Card from '../models/card';
import {
  notFoundError,
  requestError,
  serverError,
} from '../constants/messages';
import { CustomRequest } from '../types/express';

export const getCard = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (err) {
    return res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: serverError });
  }
};

export const createCard = async (req: CustomRequest, res: Response) => {
  try {
    const owner = req.user?._id;
    const { name, link } = req.body;
    return res
      .status(constants.HTTP_STATUS_CREATED)
      .send(await Card.create({ name, link, owner }));
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

export const deleteCard = async (req: CustomRequest, res: Response) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndDelete(cardId).orFail(() => {
      const error = new Error('Карточка не найдена');
      error.name = notFoundError;
      return error;
    });
    if (card.owner.toString() !== req.user?._id) {
      const error = new Error('Удаление чужих карточек запрещено');
      error.name = requestError;
      return error;
    }
    return res.send(card);
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

export const likeCard = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId as unknown as ObjectId } },
      { new: true },
    )
      .orFail(() => {
        const error = new Error('Пользователь не найден');
        error.name = notFoundError;
        return error;
      });
    return res.send(card);
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

export const dislikeCard = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId as unknown as ObjectId } },
      { new: true },
    )
      .orFail(() => {
        const error = new Error('Пользователь не найден');
        error.name = notFoundError;
        return error;
      });
    return res.send(card);
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
