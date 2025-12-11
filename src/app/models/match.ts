import { Team } from './team';
export interface Match {
  id: number;
  title?: string;
  homeTeamId: number;
  awayTeamId: number;
  homeTeam?: Team;
  awayTeam?: Team;
  matchDate: string; // ISO string
  venue: string;
}
