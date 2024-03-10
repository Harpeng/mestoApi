// eslint-disable-next-line import/no-extraneous-dependencies
import { Request } from 'express';

export interface CustomRequest extends Request {
  user?: {
    _id: any;
  };
}
