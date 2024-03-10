import { Schema, model } from 'mongoose';
import validator from 'validator';

const userSchema = new Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minLength: [2, 'Минимальная длина 2 символа'],
    maxLength: [30, 'Максимальная длина 30 символов'],
  },
  about: {
    type: String,
    default: 'Исследователь',
    minLength: [2, 'Минимальная длина 2 символа'],
    maxLength: [200, 'Максимальная длина 200 символов'],
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: (v: string) => validator.isURL(v),
  },
  email: {
    type: String,
    required: [true, 'Поле обязательно для заполнения'],
    validate: (v: string) => validator.isEmail(v),
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Поле обязательно для заполнения'],
    select: false,
  },
});

export default model('user', userSchema);
