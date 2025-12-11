import { Match } from './match';
export interface MatchResult {
  id: number;
  matchId: number;
  homeScore: number;
  awayScore: number;
  winner?: string;
  match?: Match;
}
