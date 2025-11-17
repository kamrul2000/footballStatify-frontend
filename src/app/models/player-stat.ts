import { Player } from './player';
import { Match } from './match';
export interface PlayerStat {
  id: number;
  playerId: number;
  matchId: number;
  goals: number;
  player?: Player;
  match?: Match;
}
