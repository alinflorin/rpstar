import { Microservice } from '@rpstar/microservices-framework/microservice';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { RunnerInputDto, ModuleDto } from '@rpstar/common/dto';

let input: RunnerInputDto;
if (process.argv.length >= 3) {
  input = JSON.parse(process.argv[2]);
} else {
  throw new Error('Cannot start runner - no input provided!');
}

const service = new Microservice('runner-' + input.containerName);

let init = of<any>({});

init.subscribe(() => {
  service.addService({
    name: 'runner-' + input.containerName,
    actions: {
      compileModule: {
        handler: async ctx => {
          return {
            owner: 'hahaha'
          } as ModuleDto;
        }
      }
    }
  });
  service.start().subscribe(() => {
    console.log('Runner ' + input.containerName + ' started successfully!!!');
  });
});