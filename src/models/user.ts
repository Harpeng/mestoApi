import { Schema, model } from "mongoose";
import validator from 'validator';


const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Поле обязательно для заполнения"],
    minLength: [2, "Минимальная длина 2 символа"],
    maxLength: [30, "Максимальная длина 30 символов"]
  },
  about: {
    type: String,
    required: [true, "Поле обязательно для заполнения"],
    minLength: [2, "Минимальная длина 2 символа"],
    maxLength: [200, "Максимальная длина 200 символов"]
  },
  avatar: {
    type: String,
    validate: (v: string) => validator.isURL(v),
    required: [true, "Поле обязательно для заполнения"],
  }
})

export default model('user', userSchema);