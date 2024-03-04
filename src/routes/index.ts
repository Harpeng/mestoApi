import { NextFunction, Request, Response, Router } from "express";
import userRouter from "./users";
import cardRouter from "./cards";
import { constants } from "http2";

const router = Router();
router.use("/users", userRouter);
router.use("/cards", cardRouter);

router.get('*', (_req: Request, _res: Response) => {
  _res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Запрашиваемый ресурс не найден' });
});

export default router;