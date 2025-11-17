import { Team } from './team';
export interface Player {
  id: number;
  name: string;
  position: string;
  age: number;
  teamId?: number;
  team?: Team; // circular import requires Team declared first or use import type
}
