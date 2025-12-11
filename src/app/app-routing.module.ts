import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayersListComponent } from './components/players/players-list.component';
import { AddPlayerComponent } from './components/players/add-player/add-player.component';
import { AddTeamComponent } from './components/add-team/add-team.component';
import { AddMatchComponent } from './components/matches/add-match/add-match.component';
import { TeamsComponent } from './components/teams/teams-list/teams.component';
import { MatchesListComponent } from './components/matches/matches-list/matches-list.component';
import { MatchResultsListComponent } from './components/match-results/match-results-list/match-results-list.component';
import { PlayerStatsListComponent } from './components/player-stats/player-stats-list/player-stats-list.component';
import { AddMatchResultComponent } from './components/match-results/add-match-result/add-match-result.component';
import { AddPlayerStatsComponent } from './components/player-stats/add-player-stats/add-player-stats.component';
import { MatchDetailComponent } from './components/matches/match-detail/match-detail.component';
import { PlayerDetailComponent } from './components/players/player-detail/player-detail.component';
import { TeamDetailComponent } from './components/teams/team-detail/team-detail.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FixtureGeneratorComponent } from './components/fixture-generator/fixture-generator.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  
  // Teams routes
  { path: 'teams', component: TeamsComponent },
  { path: 'teams/create', component: AddTeamComponent },
  { path: 'teams/edit/:id', component: AddTeamComponent },
  { path: 'teams/:id', component: TeamDetailComponent },
  
  // Players routes
  { path: 'players', component: PlayersListComponent },
  { path: 'players/create', component: AddPlayerComponent },
  { path: 'players/edit/:id', component: AddPlayerComponent },
  { path: 'players/:id', component: PlayerDetailComponent },
  
  // Matches routes
  { path: 'matches', component: MatchesListComponent },
  { path: 'matches/create', component: AddMatchComponent },
  { path: 'matches/edit/:id', component: AddMatchComponent },
  { path: 'matches/:id', component: MatchDetailComponent },
  
  // Match Results routes
  { path: 'match-results', component: MatchResultsListComponent },
  { path: 'match-results/create', component: AddMatchResultComponent },
  { path: 'match-results/edit/:id', component: AddMatchResultComponent },
  
  // Player Stats routes
  { path: 'player-stats', component: PlayerStatsListComponent },
  { path: 'player-stats/create', component: AddPlayerStatsComponent },
  { path: 'player-stats/edit/:id', component: AddPlayerStatsComponent },
  
  // Fixture Generator
  { path: 'fixture-generator', component: FixtureGeneratorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
