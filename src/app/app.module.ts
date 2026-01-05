import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayersListComponent } from './components/players/players-list.component';
import { AddPlayerComponent } from './components/players/add-player/add-player.component';
import { AddMatchComponent } from './components/matches/add-match/add-match.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddTeamComponent } from './components/add-team/add-team.component';
import { TeamsComponent } from './components/teams/teams-list/teams.component';
import { MatchesListComponent } from './components/matches/matches-list/matches-list.component';
import { MatchResultsListComponent } from './components/match-results/match-results-list/match-results-list.component';
import { PlayerStatsListComponent } from './components/player-stats/player-stats-list/player-stats-list.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { AddMatchResultComponent } from './components/match-results/add-match-result/add-match-result.component';
import { AddPlayerStatsComponent } from './components/player-stats/add-player-stats/add-player-stats.component';
import { MatchDetailComponent } from './components/matches/match-detail/match-detail.component';
import { PlayerDetailComponent } from './components/players/player-detail/player-detail.component';
import { TeamDetailComponent } from './components/teams/team-detail/team-detail.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FixtureGeneratorComponent } from './components/fixture-generator/fixture-generator.component';

// 🟢 Import Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
@NgModule({
  declarations: [
    AppComponent,
    PlayersListComponent,
    AddPlayerComponent,
    AddMatchComponent,
    TeamsComponent,
    AddTeamComponent,
    MatchesListComponent,
    MatchResultsListComponent,
    PlayerStatsListComponent,
    NavigationComponent,
    AddMatchResultComponent,
    AddPlayerStatsComponent,
    MatchDetailComponent,
    PlayerDetailComponent,
    TeamDetailComponent,
    DashboardComponent,
    FixtureGeneratorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatTableModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
