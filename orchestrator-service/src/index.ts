import { Microservice } from '@rpstar/microservices-framework/microservice';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DockerClient } from './docker-client';

const service = new Microservice('orchestrator');
const dockerClient = new DockerClient(service.config);

let init = of<any>({});
if (service.config.env === 'dev') {
  init = service.start().pipe(
    switchMap(() => service.stop())
  );
}

init.subscribe(() => {
  service.addService({
    name: 'orchestrator',
    actions: {
      startRunner: {
        handler: async ctx => {
          const newRunnerUid = await dockerClient.startRunner(ctx.params.user, ctx.params.data);
          return newRunnerUid;
        }
      },
      killRunner: {
        handler: async ctx => {
          await dockerClient.killRunner(ctx.params.uid);
          return true;
        }
      }
    }
  });
  service.start().subscribe(() => {
    console.log('Service started successfully!!!');
  });
});