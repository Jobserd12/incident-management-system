import Joi from 'joi';
import { commonValidations } from './validations.js';

export const loginSchema = Joi.object({
  email: commonValidations.email,
  password: commonValidations.password
}); 