import * as passport from 'passport';
import { OAuth2Strategy } from 'passport-google-oauth';
const GoogleStrategy = OAuth2Strategy;
import { UserDto } from '@rpstar/common';

export const setupGoogleAuth = (passport: passport.PassportStatic, config: any) => {
  passport.use('google', new GoogleStrategy({
    clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
    callbackURL: `${config.frontendBaseUrl}api/oauth/callback/google`
  }, (accessToken, refreshToken, profile, done) => {
    done(null, {
      email: profile.emails[0].value,
      firstName: profile.name.familyName,
      lastName: profile.name.givenName,
      id: profile.id,
      avatarUrl: profile.photos != null && profile.photos.length > 0 ? profile.photos[0].value : null,
      provider: 'google'
    } as UserDto);
  }));
};