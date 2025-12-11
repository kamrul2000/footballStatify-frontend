import { Player } from './player';
export interface Team {
  id: number;
  name: string;
  coach?: string;
  foundingYear: any;
  players?: Player[];
}
