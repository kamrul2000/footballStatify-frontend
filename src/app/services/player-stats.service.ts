import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { PlayerStat } from '../models/player-stat';

@Injectable({ providedIn: 'root' })
export class PlayerStatsService {
  constructor(private api: ApiService) {}

  getAll(): Observable<PlayerStat[]> {
    return this.api.get<PlayerStat[]>('PlayerStats');
  }

  getById(id: number): Observable<PlayerStat> {
    return this.api.get<PlayerStat>(`PlayerStats/${id}`);
  }

  create(stat: Partial<PlayerStat>) {
    return this.api.post<PlayerStat>('PlayerStats', stat);
  }

  delete(id: number) {
    return this.api.delete<void>(`PlayerStats/${id}`);
  }

  getByPlayer(playerId: number) {
    return this.api.get<PlayerStat[]>(`PlayerStats/player/${playerId}`);
  }

  getByMatch(matchId: number) {
    return this.api.get<PlayerStat[]>(`PlayerStats/match/${matchId}`);
  }

  getTotalGoals(playerId: number) {
    return this.api.get<number>(`PlayerStats/totalgoals/${playerId}`);
  }
}
