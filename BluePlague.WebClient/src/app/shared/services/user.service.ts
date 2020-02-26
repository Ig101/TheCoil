import { Injectable } from '@angular/core';
import { ActiveUser } from '../models/active-user.model';
import { Observable, of } from 'rxjs';
import { WebCommunicationService } from './web-communication.service';
import { map, tap } from 'rxjs/operators';
import { ExternalResponse } from '../models/external-response.model';

@Injectable()
export class UserService {

  unauthorized = false;
  user: ActiveUser;
  email: string;

  constructor(
    private webCommunicationService: WebCommunicationService
  ) { }

  getActiveUser() {
    if (this.user) {
      return of({
        success: true,
        statusCode: 200,
        result: this.user
      } as ExternalResponse<ActiveUser>);
    }
    return this.webCommunicationService.get<ActiveUser>('api/user')
    .pipe(tap(result => {
      this.user = result.result;
      if (this.user) {
        this.email = this.user.email;
      } else {
        this.unauthorized = true;
      }
    }));
  }
}
