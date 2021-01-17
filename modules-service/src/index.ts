import { Microservice } from '@rpstar/microservices-framework/microservice';
import { UserDto, ModuleDto, BaseDto, NotificationDto, NotificationType } from '@rpstar/common/dto';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MongoClient, ObjectId } from 'mongodb';
import { Readable } from 'stream';
import { notifyAddModuleAction } from './notification-helpers';

const service = new Microservice('modules');

let init = of<any>({});
if (service.config.env === 'dev') {
  init = service.start().pipe(
    switchMap(() => service.stop())
  );
}

init.subscribe(() => {
  service.addService({
    name: 'modules',
    settings: {
      rest: 'modules/'
    },
    actions: {
      getmodules: {
        rest: 'GET /getmodules',
        handler: async ctx => {
          const user = ctx.meta.loggedInUser as UserDto;
          const db = new MongoClient(service.config.dbCon, { useUnifiedTopology: true });
          const client = await db.connect();
          const collection = client.db().collection<ModuleDto>('modules');
          const results = await collection.find({ $or: [{ owner: null }, { owner: user.email }] }).sort({ owner: 1, name: 1 }).toArray();
          await client.close();
          return results;
        }
      },

      addmodule: {
        rest: 'POST /addmodule',
        handler: async ctx => {
          const user = ctx.meta.loggedInUser as UserDto;
          const module: ModuleDto = ctx.params.body;
          const db = new MongoClient(service.config.dbCon, { useUnifiedTopology: true });
          const client = await db.connect();
          const collection = client.db().collection<ModuleDto>('modules');

          var existingModule = await collection
            .find({
              $and: [
                { repoUrl: module.repoUrl },
                {
                  $or: [
                    { author: null },
                    { author: user.email }
                  ]
                }
              ]
            })
            .count();

          if (existingModule > 0) {
            throw new Error('This module already exists!');
          }
          await notifyAddModuleAction(service, user, 'Module is cloning...');

          const gitResult: Readable = await service.call<any>('git', 'clone', { repoUrl: module.repoUrl }).toPromise();

          await notifyAddModuleAction(service, user, 'Starting sandbox...');

          const containerUid = await service.call<string>('orchestrator', 'startRunner', {
            user: user,
            data: {}
          }).toPromise();
          try {
            const containerSvc = `runner-${containerUid}`;
            await service.waitForServices(containerSvc).toPromise();

            await notifyAddModuleAction(service, user, 'Module is being compiled...');

            const compilationResult = await service.call<ModuleDto>(containerSvc, 'compileModule', { files: null }).toPromise();
            console.log(compilationResult);

            await notifyAddModuleAction(service, user, 'Module is being verified...');

            await service.call<string>('orchestrator', 'killRunner', {
              uid: containerUid
            }).toPromise();

            const newModule: ModuleDto = {
              _id: new ObjectId(),
              author: 'some-author',
              avatarUrl: 'http://t1.gstatic.com/images?q=tbn:ANd9GcSg1P-Mciucd0ksbs-j0HrTw1B83xvnrcqkt-0i-nsbGuLVsiDEcBRHR89opSBgNxAuSmpZYKXgCWJ7Sz32yjw',
              name: 'some-module',
              owner: user.email,
              repoUrl: module.repoUrl
            };
            await collection.insertOne(newModule);
            await client.close();
            return newModule;
          } finally {
            await service.call<string>('orchestrator', 'killRunner', {
              uid: containerUid
            }).toPromise();
          }
        }
      },

      deletemodule: {
        rest: 'DELETE /deletemodule/:moduleId',
        handler: async ctx => {
          const moduleId: string = ctx.params.params.moduleId;
          console.log(moduleId);
          const user = ctx.meta.loggedInUser as UserDto;
          const db = new MongoClient(service.config.dbCon, { useUnifiedTopology: true });
          const client = await db.connect();
          const collection = client.db().collection<ModuleDto>('modules');
          const foundModule = await collection.findOne({ owner: user.email, _id: new ObjectId(moduleId) });
          if (foundModule == null) {
            throw new Error('Module not found');
          }
          const deletionResult = await collection.deleteOne({ _id: new ObjectId(moduleId), owner: user.email });
          await client.close();
          return {
            errors: deletionResult.deletedCount !== 1 ? ['Deletion failed'] : null
          } as BaseDto;
        }
      }
    }
  });
  service.start().subscribe(() => {
    console.log('Service started successfully!!!');
  });
});
