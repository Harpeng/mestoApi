// eslint-disable-next-line import/no-extraneous-dependencies
import { NextFunction, Request, Response } from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import jwt, { JwtPayload } from 'jsonwebtoken';
import { unauthorized } from '../constants/messages';
import UnauthorizedError from '../errors/unauthorized-error';

interface SessionRequest extends Request {
  user?: string | JwtPayload;
}

// eslint-disable-next-line consistent-return
export default (req: SessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError(unauthorized));
  }
  const token = authorization?.replace('Bearer', '');
  let payload;

  try {
    if (token) {
      payload = jwt.verify(token, 'some-secret-key');
    }
  } catch (err) {
    next(new UnauthorizedError(unauthorized));
  }

  req.user = payload as { _id: JwtPayload };

  next();
};
