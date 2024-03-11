import { NextFunction, Request, Response } from 'express';
import { constants } from 'http2';
import { Error as MongooseError, ObjectId } from 'mongoose';
import Card from '../models/card';
import {
  notFoundError,
  requestError,
} from '../constants/messages';
import { CustomRequest } from '../types/express';
import BadRequestError from '../errors/bad-request-error';
import NotFoundError from '../errors/not-found-error';
import ForbiddenError from '../errors/forbidden-error';

export const getCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (err) {
    return next(err);
  }
};

export const createCard = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const owner = req.user?._id;
    const { name, link } = req.body;
    return res
      .status(constants.HTTP_STATUS_CREATED)
      .send(await Card.create({ name, link, owner }));
  } catch (err) {
    if (err instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(requestError));
    }
    return next(err);
  }
};

export const deleteCard = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId)
      .orFail(() => new NotFoundError(notFoundError));
    if (card.owner.toString() !== req.user?._id) {
      return next(new ForbiddenError('Удаление чужих карточек запрещено'));
    }
    await card.deleteOne();
    return res.send(card);
  } catch (err) {
    if (err instanceof MongooseError.CastError) {
      return next(new BadRequestError(requestError));
    }
    if (err instanceof Error && err.name === notFoundError) {
      return next(new NotFoundError(notFoundError));
    }
    return next(err);
  }
};

export const likeCard = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId as unknown as ObjectId } },
      { new: true },
    )
      .orFail(() => new NotFoundError(notFoundError));
    return res.send(card);
  } catch (err) {
    if (err instanceof MongooseError.CastError) {
      return next(new BadRequestError(requestError));
    }
    if (err instanceof Error && err.name === notFoundError) {
      return next(new NotFoundError(notFoundError));
    }
    return next(err);
  }
};

export const dislikeCard = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId as unknown as ObjectId } },
      { new: true },
    )
      .orFail(() => new NotFoundError(notFoundError));
    return res.send(card);
  } catch (err) {
    if (err instanceof MongooseError.CastError) {
      return next(new BadRequestError(requestError));
    }
    if (err instanceof Error && err.name === notFoundError) {
      return next(new NotFoundError(notFoundError));
    }
    return next(err);
  }
};
