import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  base = environment.apiUrl;

  constructor(protected http: HttpClient) {}

  public get<T>(path: string, params?: HttpParams) {
    return this.http.get<T>(`${this.base}/${path}`, { params });
  }
  public post<T>(path: string, body: any) {
    return this.http.post<T>(`${this.base}/${path}`, body);
  }
  public put<T>(path: string, body: any) {
    return this.http.put<T>(`${this.base}/${path}`, body);
  }
  public delete<T>(path: string) {
    return this.http.delete<T>(`${this.base}/${path}`);
  }
}
