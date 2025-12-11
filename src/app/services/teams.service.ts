import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TeamsService {
  private baseUrl = 'https://localhost:7286/api/Teams'; // replace with your API

  constructor(private http: HttpClient) {}

  getAllTeams(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<any>(this.baseUrl, { params: httpParams });
  }

  getTeamById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  addTeam(team: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, team);
  }

  updateTeam(team: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${team.id}`, team);
  }

  deleteTeam(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}
