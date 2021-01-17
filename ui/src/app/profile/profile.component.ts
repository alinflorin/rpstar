import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserDto } from '@rpstar/common/dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  currentUserAsJson: string;
  currentUser: UserDto;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.auth.user.subscribe(u => {
      this.currentUser = u;
      if (this.currentUser != null) {
        this.currentUserAsJson = JSON.stringify(this.currentUser);
      }
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}
