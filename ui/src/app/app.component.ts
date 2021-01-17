import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { WsService } from './services/ws.service';
import { Subscription } from 'rxjs';
import { ToastService } from './services/toast.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private socketSub: Subscription;
  constructor(private auth: AuthService, private ws: WsService, private toast: ToastService) { }

  ngOnInit(): void {
    this.auth.user.subscribe(u => {
      if (u != null) {
        // user is logged in
        this.ws.connect();
        this.socketSub = this.ws.messages.pipe(filter(x => x.category == null && x.name == null)).subscribe(notification => {
          this.toast.info(notification.payload);
        });
        return;
      }
      // user is not logged in
      try {
        if (this.socketSub != null) {
          this.socketSub.unsubscribe();
        }
        this.ws.disconnect();
      } catch (err) {

      }
    });
  }
}
