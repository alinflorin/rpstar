import { Microservice } from '@rpstar/microservices-framework/microservice';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

const service = new Microservice('##shortProjectName##');

let init = of<any>({});
if (service.config.env === 'dev') {
  init = service.start().pipe(
    switchMap(() => service.stop())
  );
}

init.subscribe(() => {
  service.addService({
    name: '##shortProjectName##',
    actions: {
      test() {
        return 'hello';
      }
    }
  });
  service.start().subscribe(() => {
    console.log('Service started successfully!!!');
  });
});