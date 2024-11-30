import passport from 'passport';
import Boom from '@hapi/boom';
import { AUTH_MESSAGES } from '../../api/constants/messages.js';

export const authenticate = (strategy) => {
  return (req, res, next) => {
    passport.authenticate(strategy, { session: false }, (err, user, info) => {
      if (err || !user) {
        return next(Boom.unauthorized(
          err?.message || info?.message || AUTH_MESSAGES.LOGIN.INVALID_CREDENTIALS
        ));
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

export const requireAuth = authenticate('jwt'); 