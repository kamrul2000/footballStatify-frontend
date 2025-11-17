export interface PlayerMatchPerformance {
  matchId: number;
  date: string;
  goals: number;
  opponentTeam: string;
}
export interface PlayerProfileDto {
  playerId: number;
  name: string;
  position: string;
  age: number;
  teamId: number;
  teamName: string;
  totalGoals: number;
  matchPerformances: PlayerMatchPerformance[];
}
