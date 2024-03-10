import { Router } from 'express';
import {
  createCard,
  getCard,
  deleteCard,
  likeCard,
  dislikeCard,
} from '../controlers/cards';
import { validateCardId, validateCreateCard } from '../middlewares/validation';

const cardRouter = Router();

cardRouter.get('/', getCard);

cardRouter.delete('/:cardId', validateCardId, deleteCard);

cardRouter.delete('/:cardId/likes', validateCardId, dislikeCard);

cardRouter.put('/:cardId/likes', validateCardId, likeCard);

cardRouter.post('/', validateCreateCard, createCard);

export default cardRouter;
