import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ToastService } from '../toast.service';
import { catchError, tap } from 'rxjs/operators';
import { LoaderService } from '../loader.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private toastService: ToastService, private loaderService: LoaderService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderService.logRequest(req);
    return next.handle(req).pipe(
      tap(r => {
        if (r instanceof HttpResponse) {
          this.loaderService.requestFinished(req);
        }
      }),
      catchError(err => {
        this.loaderService.requestFinished(req);
        if (err instanceof HttpErrorResponse) {
          const httpErrorResponse = err as HttpErrorResponse;
          if (httpErrorResponse.error != null) {
            this.toastService.error(httpErrorResponse.error.message);
          }
          if (httpErrorResponse.status === 401) {
            this.router.navigate(['login']);
          }
        }
        return throwError(err);
      })
    );
  }

}
