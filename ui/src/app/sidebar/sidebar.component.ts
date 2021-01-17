import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '../services/auth.service';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserDto } from '@rpstar/common/dto';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav', { static: true }) sidenav: MatSidenav;
  private routerEventsSubscription: Subscription;
  user: UserDto;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.routerEventsSubscription = this.router.events.subscribe(e => {
      if (e instanceof NavigationStart && this.sidenav.opened) {
        this.sidenav.close();
      }
    });

    this.auth.user.subscribe(u => {
      this.user = u;
    });
  }

  ngOnDestroy() {
    if (this.routerEventsSubscription != null) {
      this.routerEventsSubscription.unsubscribe();
    }
  }

}
