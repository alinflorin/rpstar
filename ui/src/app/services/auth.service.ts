import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserDto } from '@rpstar/common/dto';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private subj: BehaviorSubject<UserDto>;
  constructor(private jwtHelper: JwtHelperService) {
    this.subj = new BehaviorSubject<UserDto>(this.readUser());
  }

  loginBySetToken(token: string) {
    localStorage.setItem('access_token', token);
    this.subj.next(this.readUser());
  }

  logout() {
    localStorage.removeItem('access_token');
    this.subj.next(null);
  }

  private readUser() {
    if (this.token == null) {
      return null;
    }
    try {
      if (this.jwtHelper.isTokenExpired(this.token)) {
        return null;
      }
      const decoded = this.jwtHelper.decodeToken(this.token);
      if (decoded == null) {
        return null;
      }
      return decoded as UserDto;
    } catch (err) {
      return null;
    }
  }

  get user() {
    return this.subj.asObservable();
  }

  get isUserLoggedIn() {
    return this.user.pipe(map(x => x != null && x.id != null));
  }

  get token() {
    return localStorage.getItem('access_token');
  }
}
