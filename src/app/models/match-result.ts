import { Match } from './match';
export interface MatchResult {
  id: number;
  matchId: number;
  teamAGoals: number;
  teamBGoals: number;
  winner?: string;
  match?: Match;
}
