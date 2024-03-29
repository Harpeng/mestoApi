import { createCard, getCard, deleteCard, likeCard, dislikeCard } from "../controlers/cards";
import { Router } from "express";

const cardRouter = Router();

cardRouter.get("/", getCard);

cardRouter.delete("/:cardId", deleteCard);

cardRouter.delete("/:cardId/likes", dislikeCard);

cardRouter.put("/:cardId/likes", likeCard);

cardRouter.post("/", createCard);

export default cardRouter;