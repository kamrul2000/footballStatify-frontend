import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamsService } from '../../../services/teams.service';
import { PlayersService } from '../../../services/players.service';
import { MatchesService } from '../../../services/matches.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-team-detail',
  standalone: false,
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.css']
})
export class TeamDetailComponent implements OnInit {
  teamId!: number;
  team: any;
  players: any[] = [];
  matches: any[] = [];
  isLoading = false;
  playersColumns: string[] = ['name', 'position', 'jerseyNumber', 'actions'];
  matchesColumns: string[] = ['date', 'opponent', 'venue', 'actions'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private teamsSvc: TeamsService,
    private playersSvc: PlayersService,
    private matchesSvc: MatchesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.teamId = +this.route.snapshot.paramMap.get('id')!;
    this.loadTeamDetails();
  }

  loadTeamDetails() {
    this.isLoading = true;
    
    this.teamsSvc.getTeamById(this.teamId).subscribe({
      next: (team) => {
        this.team = team;
        this.loadPlayers();
        this.loadMatches();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Failed to load team details', 'Close', { duration: 3000 });
        this.router.navigate(['/teams']);
      }
    });
  }

  loadPlayers() {
    this.playersSvc.getAll().subscribe({
      next: (allPlayers) => {
        this.players = allPlayers.filter(p => p.teamId === this.teamId);
      },
      error: () => {}
    });
  }

  loadMatches() {
    this.matchesSvc.getAll().subscribe({
      next: (allMatches) => {
        this.matches = allMatches.filter(m => 
          m.homeTeamId === this.teamId || m.awayTeamId === this.teamId
        );
      },
      error: () => {}
    });
  }

  getOpponentName(match: any): string {
    return match.homeTeamId === this.teamId 
      ? `Away: Team #${match.awayTeamId}` 
      : `Home: Team #${match.homeTeamId}`;
  }

  viewPlayer(player: any) {
    this.router.navigate(['/players', player.id]);
  }

  viewMatch(match: any) {
    this.router.navigate(['/matches', match.id]);
  }

  deleteTeam() {
    if (confirm(`Are you sure you want to delete ${this.team.teamName}? This will not delete associated players.`)) {
      this.teamsSvc.deleteTeam(this.teamId).subscribe({
        next: () => {
          this.snackBar.open('Team deleted successfully', 'Close', { duration: 2000 });
          this.router.navigate(['/teams']);
        },
        error: () => {
          this.snackBar.open('Failed to delete team', 'Close', { duration: 3000 });
        }
      });
    }
  }

  editTeam() {
    this.router.navigate(['/teams/edit', this.teamId]);
  }

  addPlayer() {
    this.router.navigate(['/players/create'], { queryParams: { teamId: this.teamId } });
  }

  goBack() {
    this.router.navigate(['/teams']);
  }
}
