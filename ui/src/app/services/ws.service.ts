import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { AuthService } from './auth.service';
import { NotificationDto } from '@rpstar/common/dto/notification.dto';

@Injectable({
  providedIn: 'root'
})
export class WsService {

  constructor(private socket: Socket, private auth: AuthService) { }

  connect() {
    this.socket.ioSocket.io.opts.query = {
      token: this.auth.token
    };
    this.socket.connect();
  }

  disconnect() {
    this.socket.ioSocket.io.opts.query = {};
    this.socket.disconnect();
  }

  get messages() {
    return this.socket.fromEvent<NotificationDto>('message');
  }
}
