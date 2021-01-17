import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-oauth-callback',
  templateUrl: './oauth-callback.component.html',
  styleUrls: ['./oauth-callback.component.scss']
})
export class OauthCallbackComponent implements OnInit {

  constructor(private actRoute: ActivatedRoute, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.actRoute.queryParams.subscribe(qp => {
      if (qp['token'] != null) {
        this.authService.loginBySetToken(qp['token']);
      }
      this.router.navigate(['/']);
    });
  }
}
