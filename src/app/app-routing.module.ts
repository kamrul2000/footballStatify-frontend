import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayersListComponent } from './components/players/players-list.component';
import { AddPlayerComponent } from './components/players/add-player/add-player.component';
import { AddTeamComponent } from './components/add-team/add-team.component';
import { AddMatchComponent } from './components/matches/add-match/add-match.component';
import { TeamsListComponent } from './components/teams/teams-list/teams-list.component';
// import { PlayerProfileComponent } from './components/players/player-profile.component';
// import { TeamsListComponent } from './components/teams/teams-list.component';
// import { MatchesListComponent } from './components/matches/matches-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'players', pathMatch: 'full' },
  { path: 'players', component: PlayersListComponent },
  {
  path: 'players/create',
  component: AddPlayerComponent
},
  { path: 'teams/create', component: AddTeamComponent },
  { path: 'matches/create', component: AddMatchComponent },
  { path: 'teams', component: TeamsListComponent },

//   { path: 'players/:id', component: PlayerProfileComponent },
//   { path: 'matches', component: MatchesListComponent },
  // add create/edit routes as needed
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
