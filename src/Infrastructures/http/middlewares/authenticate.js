import jwt from 'jsonwebtoken';
import AuthenticationError from '../../../Commons/exceptions/AuthenticationError.js';
import config from '../../../Commons/config.js';

const authenticate = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new AuthenticationError('Missing authentication');
    }

    const [scheme, accessToken] = authorization.split(' ');

    if (scheme !== 'Bearer' || !accessToken) {
      throw new AuthenticationError('Missing authentication');
    }

    const decodedPayload = jwt.verify(accessToken, config.auth.accessTokenKey);

    req.auth = {
      credentials: {
        id: decodedPayload.id,
        username: decodedPayload.username,
      },
    };

    next();
  } catch {
    next(new AuthenticationError('Missing authentication'));
  }
};

export default authenticate;
