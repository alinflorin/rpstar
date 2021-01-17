import * as passport from 'passport';
import { UserDto } from '@rpstar/common';
import * as AzureOAuth2Strategy from 'passport-azure-oauth2';
import { Microservice } from '@rpstar/microservices-framework/microservice';
import * as jwt from 'jwt-simple';

export const setupMicrosoftAuth = (passport: passport.PassportStatic, config: any, service: Microservice) => {
  passport.use('microsoft', new AzureOAuth2Strategy({
    clientID: process.env.MICROSOFT_AUTH_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_AUTH_CLIENT_SECRET,
    callbackURL: `${config.frontendBaseUrl}api/oauth/callback/microsoft`,
    resource: '',
    tenant: process.env.MICROSOFT_AUTH_TENANT,
    state: false
  }, (accessToken, refreshtoken, params, profile, done) => {
    const prof = jwt.decode(params.id_token, "", true);
    done(null, {
      email: prof.email,
      firstName: prof.given_name,
      lastName: prof.family_name,
      id: prof.sub,
      avatarUrl: null,
      provider: 'microsoft'
    } as UserDto);
  }));
};