import Joi, { ObjectSchema } from 'joi';
import { userData } from '../types/userTypes';

const createUserSchema: ObjectSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': "Digite um e-mail válido",
        'any.required': "Todos os campos são obrigatórios",}),
    username: Joi.string().required().messages({
        'string.empty': "Todos os campos são obrigatórios",
        'any.required': "Todos os campos são obrigatórios"}),
    password: Joi.string().min(8).required().messages({
        'string.empty': "Todos os campos são obrigatórios",
        'string.min': "O campo senha deve ter pelo menos 8 caracteres",
        'any.required': "Todos os campos são obrigatórios"}),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'string.empty': "Todos os campos são obrigatórios",
        'any.required': "Todos os campos são obrigatórios",
        'any.only': "A confirmação de senha não confere!",}),
})

const userSchema: ObjectSchema = Joi.object<userData>({
    username: Joi.string().required().messages({
        'string.empty': "Todos os campos são obrigatórios",
        'any.required': "Todos os campos são obrigatórios"}),
    password: Joi.string().min(8).required().messages({
        'string.empty': "Todos os campos são obrigatórios",
        'string.min': "O campo senha deve ter pelo menos 8 caracteres",
        'any.required': "Todos os campos são obrigatórios"}),
})

export {
    createUserSchema,
    userSchema
}