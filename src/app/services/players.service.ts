import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Player } from '../models/player';
import { PlayerProfileDto } from '../models/dtos/player-profile.dto';

@Injectable({ providedIn: 'root' })
export class PlayersService {
  constructor(private api: ApiService) {}

  getAll(): Observable<Player[]> {
    return this.api.get<Player[]>('Players');
  }

  getById(id: number) {
    return this.api.get<Player>(`Players/${id}`);
  }

  create(player: Partial<Player>) {
    return this.api.post<Player>('Players', player);
  }

  update(id: number, player: Player) {
    return this.api.put<void>(`Players/${id}`, player);
  }

  delete(id: number) {
    return this.api.delete<void>(`Players/${id}`);
  }

  getProfile(playerId: number) {
    return this.api.get<PlayerProfileDto>(`Players/profile/${playerId}`);
  }
}
