import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config';

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateAccessToken = (userId: string, role: string): string => {
  const options: SignOptions = {
    expiresIn: config.jwt.accessExpiresIn as any,
  };
  return jwt.sign(
    { userId, role },
    config.jwt.accessSecret,
    options
  );
};

export const generateRefreshToken = (userId: string): string => {
  const options: SignOptions = {
    expiresIn: config.jwt.refreshExpiresIn as any,
  };
  return jwt.sign(
    { userId },
    config.jwt.refreshSecret,
    options
  );
};

export const verifyAccessToken = (token: string): { userId: string; role: string } => {
  const decoded = jwt.verify(token, config.jwt.accessSecret) as { userId: string; role: string };
  return decoded;
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  const decoded = jwt.verify(token, config.jwt.refreshSecret) as { userId: string };
  return decoded;
};
