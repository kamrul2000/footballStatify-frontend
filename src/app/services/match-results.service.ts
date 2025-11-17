import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { MatchResult } from '../models/match-result';

@Injectable({ providedIn: 'root' })
export class MatchResultsService {
  constructor(private api: ApiService) {}

  getAll(): Observable<MatchResult[]> {
    return this.api.get<MatchResult[]>('MatchResults');
  }

  getById(id: number): Observable<MatchResult> {
    return this.api.get<MatchResult>(`MatchResults/${id}`);
  }

  create(result: Partial<MatchResult>) {
    return this.api.post<MatchResult>('MatchResults', result);
  }

  update(id: number, result: MatchResult) {
    return this.api.put<void>(`MatchResults/${id}`, result);
  }

  delete(id: number) {
    return this.api.delete<void>(`MatchResults/${id}`);
  }
}
