import Joi from 'joi';
import { commonValidations } from './validations.js';

export const loginSchema = Joi.object({
  body: Joi.object({
    email: commonValidations.email,
    password: commonValidations.password
  }).required()
});