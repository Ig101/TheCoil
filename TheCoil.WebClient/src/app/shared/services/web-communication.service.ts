import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { ExternalResponse } from '../models/external-response.model';
import { of } from 'rxjs';

@Injectable()
export class WebCommunicationService {

  constructor(private httpClient: HttpClient) { }

  handleError<T>(result: HttpErrorResponse) {
    if (result.status === 400) {
      return of({
        success: false,
        statusCode: result.status,
        errors: result.error ? (Object.values(result.error.errors) as string[][]).reduce((sum, next) => sum.concat(next), []) : []
      } as ExternalResponse<T>);
    } else {
      return of({
        success: false,
        statusCode: result.status,
        errors: result.error && result.error.title ? [result.error.title] : ['Unexpected error. Try again later...']
      } as ExternalResponse<T>);
    }
  }

  get<T>(url: string, params?: { [param: string]: string }, headers?: { [param: string]: string }) {
    return this.httpClient.get<T>(url,
    {
      headers,
      params
    })
    .pipe(map(result => {
      return {
        success: true,
        result
      } as ExternalResponse<T>;
    }))
    .pipe(catchError((result) => this.handleError<T>(result)));
  }

  post<Tin, Tout>(url: string, body: Tin, headers?: { [param: string]: string }) {
    return this.httpClient.post<Tout>(url, body,
      {
        headers
      })
      .pipe(map(result => {
        return {
          success: true,
          result
        } as ExternalResponse<Tout>;
      }))
      .pipe(catchError((result) => this.handleError<Tout>(result)));
  }

  put<Tin, Tout>(url: string, body: Tin, headers?: { [param: string]: string }) {
    return this.httpClient.put<Tout>(url, body,
      {
        headers
      })
      .pipe(map(result => {
        return {
          success: true,
          result
        } as ExternalResponse<Tout>;
      }))
      .pipe(catchError((result) => this.handleError<Tout>(result)));
  }

  delete<T>(url: string, params?: { [param: string]: string }, headers?: { [param: string]: string }) {
    return this.httpClient.delete<T>(url,
      {
        headers,
        params
      })
      .pipe(map(result => {
        return {
          success: true,
          result
        } as ExternalResponse<T>;
      }))
      .pipe(catchError((result) => this.handleError<T>(result)));
  }
}
