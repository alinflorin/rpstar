import { ServerResponse } from "http";
import { Microservice } from "@rpstar/microservices-framework/microservice";

export const oauthCallbackHandler = (service: Microservice) => {
  return (req: any, res: ServerResponse) => {
    res.statusCode = 302;
    if (!req.user) {
      res.setHeader('Location', `/error?message=${encodeURIComponent('Login failed!')}`);
      res.end();
      return;
    }
    service.call<string>('auth', 'generatejwt', req.user).subscribe(token => {
      res.setHeader('Location', `/oauth-callback?token=${token}`);
      res.end();
    }, err => {
      res.setHeader('Location', `/error?message=${encodeURIComponent('Login failed!')}`);
      res.end();
    });
  };
}