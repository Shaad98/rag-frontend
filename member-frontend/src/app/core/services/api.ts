import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type QueryParams = Record<string, string | number | boolean | undefined | null>;

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl; // e.g. 'https://api.shaadrag.online'

  private buildParams(params?: QueryParams): HttpParams {
    let httpParams = new HttpParams();
    if (!params) return httpParams;

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, String(value));
      }
    });

    return httpParams;
  }

  get<T>(path: string, params?: QueryParams): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${path}`, {
      params: this.buildParams(params),
    });
  }

  post<T, B = unknown>(path: string, body: B, params?: QueryParams): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${path}`, body, {
      params: this.buildParams(params),
    });
  }

  put<T, B = unknown>(path: string, body: B, params?: QueryParams): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${path}`, body, {
      params: this.buildParams(params),
    });
  }

  patch<T, B = unknown>(path: string, body: B, params?: QueryParams): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${path}`, body, {
      params: this.buildParams(params),
    });
  }

  delete<T>(path: string, params?: QueryParams): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${path}`, {
      params: this.buildParams(params),
    });
  }
}