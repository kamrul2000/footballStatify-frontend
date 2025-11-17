import { Team } from './team';
export interface Match {
  id: number;
  title?: string;
  teamAId: number;
  teamBId: number;
  teamA?: Team;
  teamB?: Team;
  matchDate: string; // ISO string
  venue?: string;
}
