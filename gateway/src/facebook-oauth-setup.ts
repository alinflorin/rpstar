import * as passport from 'passport';
import { UserDto } from '@rpstar/common';
import { Strategy } from 'passport-facebook';
const FacebookStrategy = Strategy;

export const setupFacebookAuth = (passport: passport.PassportStatic, config: any) => {
  passport.use('facebook', new FacebookStrategy({
    clientID: process.env.FACEBOOK_AUTH_APP_ID,
    clientSecret: process.env.FACEBOOK_AUTH_APP_SECRET,
    profileFields: ['id', 'emails', 'name', 'picture'],
    callbackURL: `${config.frontendBaseUrl}api/oauth/callback/facebook`
  }, (accessToken, refreshToken, profile, done) => {
    done(null, {
      email: profile.emails[0].value,
      firstName: profile.name.familyName,
      lastName: profile.name.givenName,
      id: profile.id,
      avatarUrl: profile.photos != null && profile.photos.length > 0 ? profile.photos[0].value : null,
      provider: 'facebook'
    } as UserDto);
  }));
};