import { Microservice } from '@rpstar/microservices-framework/microservice';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { GitClient } from './git-client';
import * as uuid from 'uuid';

const service = new Microservice('git');
const gitClient = new GitClient(service.config);

let init = of<any>({});
if (service.config.env === 'dev') {
  init = service.start().pipe(
    switchMap(() => service.stop())
  );
}

init.subscribe(() => {
  service.addService({
    name: 'git',
    actions: {
      clone: {
        handler: async ctx => {
          const repoUrl: string = ctx.params.repoUrl;
          return await gitClient.clone(repoUrl, `${uuid.v1()}`);
        }
      }
    }
  });

  service.start().subscribe(() => {
    console.log('Service started successfully!!!');
  });
});