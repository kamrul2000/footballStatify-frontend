import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchesService } from '../../../services/matches.service';
import { MatchResultsService } from '../../../services/match-results.service';
import { PlayerStatsService } from '../../../services/player-stats.service';
import { TeamsService } from '../../../services/teams.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Player } from '../../../models/player';
import { Team } from '../../../models/team';

@Component({
  selector: 'app-match-detail',
  standalone: false,
  templateUrl: './match-detail.component.html',
  styleUrls: ['./match-detail.component.css']
})
export class MatchDetailComponent implements OnInit {
  matchId!: number;
  match: any;
  matchResult: any;
  playerStats: any[] = [];
  teamAId: any;
  teamBId: any;
  isLoading = false;
  teamsMap: { [id: number]: Team } = {};
  playersMap: { [id: number]: Player } = {};  
  
  displayedColumns: string[] = ['player', 'goals', 'assists', 'yellowCards', 'redCards'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchesSvc: MatchesService,
    private matchResultsSvc: MatchResultsService,
    private playerStatsSvc: PlayerStatsService,
    private teamsSvc: TeamsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.matchId = +this.route.snapshot.paramMap.get('id')!;
    this.loadMatchDetails();
  }

  loadMatchDetails() {
    this.isLoading = true;
    
    this.matchesSvc.getById(this.matchId).subscribe({
      next: (match) => {
        this.match = match;
        this.loadTeams();
        this.loadMatchResult();
        this.loadPlayerStats();

      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Failed to load match details', 'Close', { duration: 3000 });
        this.router.navigate(['/matches']);
      }
    });
  }

  loadTeams() {
    if (this.match.teamAId) {
      this.teamsSvc.getTeamById(this.match.teamAId).subscribe({
        next: (team) => {
          this.teamAId = team;
          this.teamsMap[this.match.teamAId] = team; // Add to teamsMap
        },
        error: () => {}
      });
    }
    
    if (this.match.awayTeamId) {
      this.teamsSvc.getTeamById(this.match.teamBId).subscribe({
        next: (team) => {
          this.teamBId = team;
          this.teamsMap[this.match.teamBId] = team; 
        },
        error: () => {}
      });
    }
  }

  loadMatchResult() {
    this.matchResultsSvc.getAll().subscribe({
      next: (results) => {
        this.matchResult = results.find(r => r.matchId === this.matchId);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  loadPlayerStats() {
    this.playerStatsSvc.getByMatch(this.matchId).subscribe({
      next: (stats) => {
        this.playerStats = stats;
      },
      error: () => {}
    });
  }

  deleteMatch() {
    if (confirm('Are you sure you want to delete this match?')) {
      this.matchesSvc.delete(this.matchId).subscribe({
        next: () => {
          this.snackBar.open('Match deleted successfully', 'Close', { duration: 2000 });
          this.router.navigate(['/matches']);
        },
        error: () => {
          this.snackBar.open('Failed to delete match', 'Close', { duration: 3000 });
        }
      });
    }
  }
getTeamNameById(id: number): string {
    return this.teamsMap[id]?.name || id.toString();
  }
  addResult() {
    this.router.navigate(['/match-results/create'], { queryParams: { matchId: this.matchId } });
  }

  addPlayerStats() {
    this.router.navigate(['/player-stats/create'], { queryParams: { matchId: this.matchId } });
  }

  goBack() {
    this.router.navigate(['/matches']);
  }
}
