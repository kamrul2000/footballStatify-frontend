import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayersListComponent } from './components/players/players-list.component';
import { AddPlayerComponent } from './components/players/add-player/add-player.component';
import { AddTeamComponent } from './components/add-team/add-team.component';
import { AddMatchComponent } from './components/matches/add-match/add-match.component';
import { TeamsListComponent } from './components/teams/teams-list/teams-list.component';
// import { PlayerProfileComponent } from './components/players/player-profile.component';
// import { TeamsListComponent } from './components/teams/teams-list.component';
// import { MatchesListComponent } from './components/matches/matches-list.component';

@NgModule({
  declarations: [
    AppComponent,
    PlayersListComponent,
    AddPlayerComponent,
    AddTeamComponent,
    AddMatchComponent,
    TeamsListComponent,
//    PlayerProfileComponent,
//    MatchesListComponent
  ],
  imports: [
    BrowserModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule,
  AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }