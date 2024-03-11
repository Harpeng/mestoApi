// eslint-disable-next-line import/no-extraneous-dependencies
import { celebrate, Joi } from 'celebrate';
import { urlRegExp, emailRegExp } from '../utils/config';

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().pattern(emailRegExp).required(),
    password: Joi.string().required().min(6),
  }),
});

const validateUser = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24).required(),
  }),
});

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().pattern(urlRegExp),
    password: Joi.string().required().min(6),
    email: Joi.string().pattern(emailRegExp).required(),
  }),
});

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    about: Joi.string().min(2).max(200),
    name: Joi.string().min(2).max(30),
  }),
});

const validateUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string(),
  }),
});

const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().pattern(urlRegExp),
  }),
});

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).required(),
  }),
});

export {
  validateLogin,
  validateUser,
  validateCreateUser,
  validateUpdateUser,
  validateUpdateAvatar,
  validateCardId,
  validateCreateCard,
};
