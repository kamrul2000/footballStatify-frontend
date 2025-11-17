import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Match } from '../models/match';

@Injectable({ providedIn: 'root' })
export class MatchesService {
  constructor(private api: ApiService) {}

  getAll(): Observable<Match[]> {
    return this.api.get<Match[]>('Matches');
  }

  getById(id: number): Observable<Match> {
    return this.api.get<Match>(`Matches/${id}`);
  }

  create(match: Partial<Match>) {
    return this.api.post<Match>('Matches', match);
  }

  update(id: number, match: Match) {
    return this.api.put<void>(`Matches/${id}`, match);
  }

  delete(id: number) {
    return this.api.delete<void>(`Matches/${id}`);
  }
}
