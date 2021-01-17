import { Component, OnInit, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '../services/auth.service';
import { LoaderService } from '../services/loader.service';
import { UserDto } from '@rpstar/common/dto';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input() sidenav: MatSidenav;
  user: UserDto;

  constructor(private auth: AuthService, public loaderService: LoaderService) { }

  ngOnInit() {
    this.auth.user.subscribe(u => {
      this.user = u;
    });
  }

}
