import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayersService } from '../../../services/players.service';
import { PlayerStatsService } from '../../../services/player-stats.service';
import { TeamsService } from '../../../services/teams.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-player-detail',
  standalone: false,
  templateUrl: './player-detail.component.html',
  styleUrls: ['./player-detail.component.css']
})
export class PlayerDetailComponent implements OnInit {
  playerId!: number;
  player: any;
  team: any;
  playerStats: any[] = [];
  totalGoals: number = 0;
  isLoading = false;
  displayedColumns: string[] = ['match', 'goals', 'assists', 'yellowCards', 'redCards'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playersSvc: PlayersService,
    private playerStatsSvc: PlayerStatsService,
    private teamsSvc: TeamsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.playerId = +this.route.snapshot.paramMap.get('id')!;
    this.loadPlayerDetails();
  }

  loadPlayerDetails() {
    this.isLoading = true;
    
    this.playersSvc.getById(this.playerId).subscribe({
      next: (player) => {
        this.player = player;
        this.loadTeam();
        this.loadPlayerStats();
        this.loadTotalGoals();
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Failed to load player details', 'Close', { duration: 3000 });
        this.router.navigate(['/players']);
      }
    });
  }

  loadTeam() {
    if (this.player?.teamId) {
      this.teamsSvc.getTeamById(this.player.teamId).subscribe({
        next: (team) => this.team = team,
        error: () => {}
      });
    }
  }

  loadPlayerStats() {
    this.playerStatsSvc.getByPlayer(this.playerId).subscribe({
      next: (stats) => {
        this.playerStats = stats;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  loadTotalGoals() {
    this.playerStatsSvc.getTotalGoals(this.playerId).subscribe({
      next: (total) => {
        this.totalGoals = total;
      },
      error: () => {}
    });
  }

  get totalAssists(): number {
    return this.playerStats.reduce((sum, stat) => sum + (stat.assists || 0), 0);
  }

  get totalYellowCards(): number {
    return this.playerStats.reduce((sum, stat) => sum + (stat.yellowCards || 0), 0);
  }

  get totalRedCards(): number {
    return this.playerStats.reduce((sum, stat) => sum + (stat.redCards || 0), 0);
  }

  get matchesPlayed(): number {
    return this.playerStats.length;
  }

  deletePlayer() {
    if (confirm(`Are you sure you want to delete ${this.player.name}?`)) {
      this.playersSvc.delete(this.playerId).subscribe({
        next: () => {
          this.snackBar.open('Player deleted successfully', 'Close', { duration: 2000 });
          this.router.navigate(['/players']);
        },
        error: () => {
          this.snackBar.open('Failed to delete player', 'Close', { duration: 3000 });
        }
      });
    }
  }

  editPlayer() {
    this.router.navigate(['/players/edit', this.playerId]);
  }

  goBack() {
    this.router.navigate(['/players']);
  }
}
