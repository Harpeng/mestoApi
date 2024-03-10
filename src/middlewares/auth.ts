// eslint-disable-next-line import/no-extraneous-dependencies
import { NextFunction, Request, Response } from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import jwt, { JwtPayload } from 'jsonwebtoken';
import { constants } from 'http2';
import { unauthorized } from '../constants/messages';

interface SessionRequest extends Request {
  user?: string | JwtPayload;
}

// eslint-disable-next-line consistent-return
export default (req: SessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(constants.HTTP_STATUS_UNAUTHORIZED)
      .send({ message: unauthorized });
  }
  const token = authorization?.replace('Bearer', '');
  let payload;

  try {
    if (token) {
      payload = jwt.verify(token, 'some-secret-key');
    }
  } catch (err) {
    return res
      .status(constants.HTTP_STATUS_UNAUTHORIZED)
      .send({ message: unauthorized });
  }

  req.user = payload as { _id: JwtPayload };

  next();
};
