import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Team } from '../models/team';

@Injectable({ providedIn: 'root' })
export class TeamsService {
  constructor(private api: ApiService) {}

  getAll(): Observable<Team[]> {
    return this.api.get<Team[]>('Teams');
  }

  getById(id: number): Observable<Team> {
    return this.api.get<Team>(`Teams/${id}`);
  }

  create(team: Partial<Team>): Observable<Team> {
    return this.api.post<Team>('Teams', team);
  }

  update(id: number, team: Team): Observable<void> {
    return this.api.put<void>(`Teams/${id}`, team);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`Teams/${id}`);
  }
}
