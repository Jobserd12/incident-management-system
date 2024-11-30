import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import config from '../../config/config.js';
import User from '../../models/user.model.js';
import Boom from '@hapi/boom';
import userRepository from '../../repositories/user.repository.js';
import { AUTH_MESSAGES, ERROR_MESSAGES } from '../../api/constants/messages.js';

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await userRepository.findByEmailWithPassword(email);
    if (!user) {
      return done(null, false, { message: AUTH_MESSAGES.USER.NOT_FOUND });
    }
    
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return done(null, false, { message: AUTH_MESSAGES.LOGIN.INCORRECT_PASSWORD });
    }
    
    if (!user.isVerified) {
      return done(null, false, { message: AUTH_MESSAGES.LOGIN.UNVERIFIED_ACCOUNT });
    }

    user.password = undefined;
    return done(null, user);

  } catch (error) {
    return done(error);
  }
}));

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt.secret
}, async (payload, done) => {
  try {
    const user = await User.findById(payload.sub);
    if (!user) {
      return done(Boom.unauthorized(AUTH_MESSAGES.TOKEN.INVALID));
    }
    return done(null, user);
  } catch (error) {
    return done(Boom.internal(AUTH_MESSAGES.TOKEN.VERIFICATION_ERROR));
  }
}));

passport.use(new GoogleStrategy({
  clientID: config.auth.google.clientID,
  clientSecret: config.auth.google.clientSecret,
  callbackURL: config.auth.google.callbackURL,
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    if (!profile || !profile.emails || !profile.emails.length) {
      return done(Boom.badData(AUTH_MESSAGES.GOOGLE.ERROR, {
        details: 'Información de perfil incompleta'
      }));
    }

    let user = await User.findOne({ 'google.id': profile.id });
    
    if (!user) {
      const baseUsername = profile.displayName.toLowerCase().replace(/\s+/g, '');
      let username = baseUsername;
      let counter = 1;
      
      while (await User.findOne({ username })) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      try {
        user = await User.create({
          email: profile.emails[0].value,
          username: username,
          name: profile.displayName,
          google: {
            id: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            picture: profile.photos?.[0]?.value
          },
          isVerified: true
        });
      } catch (createError) {
        return done(Boom.internal(ERROR_MESSAGES.SERVER.DATABASE, {
          details: createError.message
        }));
      }
    }
    
    if (!user) {
      return done(Boom.notFound(AUTH_MESSAGES.USER.NOT_FOUND));
    }
    
    return done(null, user);
  } catch (error) {
    return done(Boom.internal(AUTH_MESSAGES.GOOGLE.ERROR, {
      details: error.message
    }));
  }
}));

export default passport; 