import { Schema, model } from 'mongoose';
import validator from 'validator';

const cardSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Поле обязательно для заполнения'],
    minLength: [2, 'Минимальная длина 2 символа'],
    maxLength: [30, 'Максимальная длина 30 символов'],
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: [true, 'Поле обязательно для заполнения'],
    ref: 'user',
  },
  link: {
    type: String,
    validate: (v: string) => validator.isURL(v),
    required: [true, 'Поле обязательно для заполнения'],
  },
  likes: {
    type: [Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model('card', cardSchema);
