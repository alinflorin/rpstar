import { Microservice } from '@rpstar/microservices-framework';
import { NotificationDto, NotificationType, UserDto } from '@rpstar/common/dto';

export async function notifyAddModuleAction(service: Microservice, user: UserDto, message: string) {
  service.invoke('gateway', 'notify', {
    to: user.email,
    category: 'modules',
    name: 'addmodule',
    payload: 'Module is cloning...',
    type: NotificationType.Message
  } as NotificationDto).toPromise();
}