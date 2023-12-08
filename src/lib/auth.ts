import jwt from 'jsonwebtoken';

export const COOKIE_NAME = 'comp-task-management.token';

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PUBLIC_KEY = process.env.PUBLIC_KEY;

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: {
    url: string;
  };
  accessToken: string;
  expiresAt: number;
}

const SignOpts: jwt.SignOptions = {
  algorithm: 'RS256',
  expiresIn: 7 * 24 * 60 * 60, // 1 week
};

export const signJWT = async (user: User) => {
  const payload = {
    type: 1,
    ...user,
  };

  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, PRIVATE_KEY!, SignOpts, (err, token) => {
      if (err) {
        return reject(err);
      }

      if (!token) {
        return reject(new Error('Token is not defined'));
      }

      resolve(token);
    });
  });
};

export const verifyJWT = async (token: string) => {
  return new Promise<User>((resolve, reject) => {
    jwt.verify(token, PUBLIC_KEY!, SignOpts, (err, decoded) => {
      if (err) {
        return reject(err);
      }

      if (!decoded) {
        return reject(new Error('Token is not defined'));
      }

      resolve(decoded as User);
    });
  });
};

export const decodeJWT = (token: string) => {
  return jwt.decode(token) as User | undefined;
};
