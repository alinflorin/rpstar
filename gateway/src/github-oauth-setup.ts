import * as passport from 'passport';
import { UserDto } from '@rpstar/common';
import { Strategy } from 'passport-github';
const GithubStrategy = Strategy;

export const setupGithubAuth = (passport: passport.PassportStatic, config: any) => {
  passport.use('github', new GithubStrategy({
    clientID: process.env.GITHUB_AUTH_CLIENT_ID,
    clientSecret: process.env.GITHUB_AUTH_CLIENT_SECRET,
    callbackURL: `${config.frontendBaseUrl}api/oauth/callback/github`
  }, (accessToken, refreshToken, profile, done) => {
    const splitName = profile.displayName.split(' ');
    done(null, {
      email: profile.emails[0].value,
      firstName: splitName.length > 0 ? splitName[0] : 'Unknown',
      lastName: splitName.length > 1 ? splitName[1] : '',
      id: profile.id,
      avatarUrl: profile.photos != null && profile.photos.length > 0 ? profile.photos[0].value : null,
      provider: 'github'
    } as UserDto);
  }));
};