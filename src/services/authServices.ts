import userRepository from '../repositories/userRepository';
import * as bcrypt from 'bcrypt';
import { userData } from '../types/userTypes';
import { unauthorizedError, duplicatedEmailError, duplicatedUsernameError } from '../utils/errorUtils';
import jwt from 'jsonwebtoken';

export async function createUser(user: userData) {

    const { email, username, password } = user;

    await validateUniqueEmailOrFail(email);
    await validateUniqueUsernameOrFail(username);

    const ROUNDS = Number(process.env.ROUNDS);
    const crypted = bcrypt.hashSync(password, ROUNDS);

    await userRepository.insert(email, username, crypted)
}

async function validateUniqueEmailOrFail(email: string) {
  const userWithSameEmail = await userRepository.findByEmail(email);
  if (userWithSameEmail) {
    throw duplicatedEmailError();
  }
}

async function validateUniqueUsernameOrFail(username: string) {
  const userWithSameUsername = await userRepository.checkUser(username);
  if (userWithSameUsername) {
    throw duplicatedUsernameError();
  }
}

export async function login(login: userData) {
    const user = await getUserOrFail(login);
    const expire = {expiresIn: 60*60*3};
    const data = {
        id: user.id
    }
    const token = jwt.sign(data, process.env.TOKEN_SECRET, expire);

    return token;
  }
  
export async function getUserOrFail(login: userData) {
    const user = await userRepository.checkUser(login.username);
    if (!user) throw unauthorizedError('Invalid credentials');
  
    const isPasswordValid = bcrypt.compareSync(login.password, user.password);
    if (!isPasswordValid) throw unauthorizedError('Invalid credentials');
  
    return user;
  }