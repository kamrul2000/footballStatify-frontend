import { Match } from './match';
export interface MatchResult {
  teamAGoals: any;
  teamBGoals: any;
  id: number;
  matchId: number;
  homeScore: number;
  awayScore: number;
  winner?: string;
  match?: Match;
}
