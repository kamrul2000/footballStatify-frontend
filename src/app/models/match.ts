import { Team } from './team';
export interface Match {
  teamBId: any;
  teamAId: any;
  id: number;
  title?: string;
  homeTeamId: number;
  awayTeamId: number;
  homeTeam?: Team;
  awayTeam?: Team;
  matchDate: string; // ISO string
  venue: string;
}
