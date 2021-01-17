import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private ongoingRequests: Set<HttpRequest<any>>;
  constructor() {
    this.ongoingRequests = new Set<HttpRequest<any>>();
  }

  logRequest(req: HttpRequest<any>) {
    this.ongoingRequests.add(req);
  }

  requestFinished(req: HttpRequest<any>) {
    try {
      this.ongoingRequests.delete(req);
    } catch (err) {

    }

  }

  get shouldShowLoader() {
    return this.ongoingRequests.size > 0;
  }
}
