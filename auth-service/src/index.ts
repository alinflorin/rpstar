import { Microservice } from '@rpstar/microservices-framework/microservice';
import { Context } from 'moleculer';
import { UserDto } from '@rpstar/common';
import * as jsonwebtoken from 'jsonwebtoken';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

const service = new Microservice('auth');

let init = of<any>({});
if (service.config.env === 'dev') {
  init = service.start().pipe(
    switchMap(() => service.stop())
  );
}

init.subscribe(() => {

  service.addService({
    name: 'auth',
    actions: {
      generatejwt(ctx: Context) {
        const user = ctx.params as UserDto;
        return jsonwebtoken.sign(user, process.env.JWT_KEY, {
          expiresIn: '7d',
          audience: service.config.jwtAudience,
          issuer: service.config.jwtIssuer,
          encoding: 'utf8',
          subject: user.email
        });
      },
      verifyjwt(ctx: Context) {
        try {
          const token = ctx.params.token;
          const result = jsonwebtoken.verify(token, process.env.JWT_KEY, {
            audience: service.config.jwtAudience,
            issuer: service.config.jwtIssuer
          });
          return result;
        } catch (err) {
          console.error(err);
          return null;
        }
      },
      unwrapjwt(ctx: Context) {
        try {
          return jsonwebtoken.decode(ctx.params.token, {
            json: true
          });
        } catch (err) {
          return null;
        }
      }
    }
  }).start().subscribe(() => {
    console.log('Service started successfully!!!');
  });
});