import { Microservice } from '@rpstar/microservices-framework/microservice';
import * as ApiService from 'moleculer-web';
import * as IoService from 'moleculer-io';
import { Context } from 'moleculer';
const E = ApiService.Errors;
import { map, switchMap, catchError } from 'rxjs/operators';
import { of, from } from 'rxjs';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import * as passport from 'passport';
import { oauthCallbackHandler } from './oauth-callback-handler';
import { IncomingMessage, ServerResponse } from 'http';
import { setupGoogleAuth } from './google-oauth-setup';
import { setupFacebookAuth } from './facebook-oauth-setup';
import { setupGithubAuth } from './github-oauth-setup';
import { setupMicrosoftAuth } from './microsoft-oauth-setup';
import { UserDto, NotificationDto } from '@rpstar/common';
import { Server, Socket } from 'socket.io';

const service = new Microservice('gateway');

setupGoogleAuth(passport, service.config);
setupFacebookAuth(passport, service.config);
setupGithubAuth(passport, service.config);
setupMicrosoftAuth(passport, service.config, service);

service.addService({
  name: 'gateway',
  mixins: [ApiService, IoService],
  actions: {
    notify: {
      handler: async ctx => {
        const notification = ctx.params as NotificationDto;
        await service.invoke('gateway', 'broadcast', {
          event: 'message',
          args: [notification],
          rooms: [notification.to]
        }).toPromise();
      }
    }
  },
  settings: {
    port: 3000,
    io: {
      namespaces: {
        '/': {
          authorization: true,
          events: {
            'call': {
              mappingPolicy: 'restrict'
            }
          }
        }
      }
    },
    routes: [
      {
        path: '/api/services',
        callOptions: {
          timeout: 30000,
          retries: 3
        },
        mergeParams: false,
        use: [
          helmet(),
          cookieParser()
        ],
        authorization: true,
        mappingPolicy: 'restrict',
        whitelist: [
          '**'
        ],
        bodyParsers: {
          json: true,
          urlencoded: { extended: true }
        },
        autoAliases: true
      },
      {
        path: '/api/oauth',
        callOptions: {
          timeout: 30000,
          retries: 3
        },
        mergeParams: false,
        use: [
          helmet(),
          cookieParser(),
          passport.initialize()
        ],
        bodyParsers: {
          json: true,
          urlencoded: { extended: true }
        },
        authorization: false,
        aliases: {
          'GET /login/google': [
            passport.authenticate('google', {
              scope: ['https://www.googleapis.com/auth/plus.login', 'profile', 'email', 'openid'],
              session: false
            })
          ],
          'GET /callback/google': [
            passport.authenticate('google', { session: false }),
            oauthCallbackHandler(service)
          ],


          'GET /login/facebook': [
            passport.authenticate('facebook', {
              session: false,
              scope: ['email']
            })
          ],
          'GET /callback/facebook': [
            passport.authenticate('facebook', { session: false }),
            oauthCallbackHandler(service)
          ],

          'GET /login/github': [
            passport.authenticate('github', {
              session: false
            })
          ],
          'GET /callback/github': [
            passport.authenticate('github', { session: false }),
            oauthCallbackHandler(service)
          ],

          'GET /login/microsoft': [
            passport.authenticate('microsoft', {
              session: false
            })
          ],
          'GET /callback/microsoft': [
            passport.authenticate('microsoft', { session: false }),
            oauthCallbackHandler(service)
          ]
        }
      }
    ]
  },
  methods: {
    authorize(ctx: Context, route, req: IncomingMessage, res: ServerResponse) {
      return of(req.headers["authorization"] as string)
        .pipe(
          map(token => {
            if (token == null || !token.startsWith('Bearer ')) {
              throw new E.UnAuthorizedError(E.ERR_NO_TOKEN, null);
            }
            return token.slice(7);
          }),
          switchMap(token => service.call<any>('auth', 'verifyjwt', { token })),
          map(user => {
            if (user == null) {
              throw new E.UnAuthorizedError(E.ERR_INVALID_TOKEN, null);
            }
            if (ctx.meta == null) {
              ctx.meta = {};
            }
            ctx.meta.loggedInUser = user as UserDto;
            return ctx;
          })
        )
        .toPromise();
    },

    async socketAuthorize(socket: Socket, eventHandler: any) {
      const token: string = socket.handshake.query.token;
      if (token == null) {
        throw new Error('Unauthorized');
      }
      const user = await service.call<UserDto>('auth', 'verifyjwt', { token: token }).toPromise();
      if (user == null) {
        throw new Error('Unauthorized');
      }
      return user;
    }
  },
  started() {
    const ioServer = this.io as Server;
    ioServer.on('connection', socket => {
      const token = socket.handshake.query.token;
      if (token == null) {
        socket.disconnect();
        return;
      }
      service.call<UserDto>('auth', 'verifyjwt', { token: token }).subscribe(user => {
        if (user == null) {
          socket.disconnect();
          return;
        }
        socket.join(user.email);
      });
    });
    return of<void>().toPromise();
  }
});


service.start().subscribe(() => {
  console.log('Gateway started!!!');
});