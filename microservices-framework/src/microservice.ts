import { ServiceBroker, ServiceSchema, Middleware } from 'moleculer';
import { from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { readConfig } from './config';

export class Microservice {
  private broker: ServiceBroker;
  private _config: any;

  get config() {
    return this._config;
  }

  get logger() {
    return this.broker.logger;
  }

  get underlyingBroker() {
    return this.broker;
  }

  constructor(private serviceName: string) {
    const cfg = readConfig();
    console.log('Initialized Microservice class');
    console.log('Config:');
    console.log(cfg);
    this._config = cfg;
    this.broker = new ServiceBroker({
      nodeID: `${this.serviceName}-node`,
      hotReload: true,
      logLevel: 'info',
      transporter: cfg.mqttConnectionString
    });
  }

  addService(schema: ServiceSchema) {
    this.broker.createService(schema);
    return this;
  }

  waitForServices(...serviceNames: string[]) {
    return from(this.broker.waitForServices(serviceNames));
  }

  start() {
    return from(this.broker.start()).pipe(catchError(err => {
      console.error('Service start failed', err);
      return throwError(err);
    }));
  }

  stop() {
    return from(this.broker.stop()).pipe(catchError(err => {
      console.error('Service stopping failed', err);
      return throwError(err);
    }));
  }

  call<T>(serviceName: string, actionName: string, data: any = null, meta: any = null) {
    return from(this.broker.call(serviceName + '.' + actionName, data, {
      meta: meta
    })).pipe(map(x => x as T));
  }

  invoke(serviceName: string, actionName: string, data: any = null, meta: any = null) {
    return from(this.broker.call(serviceName + '.' + actionName, data, {
      meta: meta
    }));
  }

  emitEvent(eventName: string, payload: any = null, groups: string[] = null) {
    return this.broker.emit(eventName, payload, groups);
  }

  addMiddleware(middleware: Middleware) {
    this.broker.middlewares.add(middleware);
    return this;
  }

  getLocalService(serviceName: string) {
    return this.broker.getLocalService(serviceName);
  }
}
