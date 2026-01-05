import { Component, OnInit } from '@angular/core';
import { PlayerStatsService } from '../../../services/player-stats.service';
import { PlayerStat } from '../../../models/player-stat';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-player-stats-list',
  standalone: false,
  templateUrl: './player-stats-list.component.html',
  styleUrls: ['./player-stats-list.component.css']
})
export class PlayerStatsListComponent implements OnInit {
  playerStats: PlayerStat[] = [];
  filteredPlayerStats: PlayerStat[] = [];
  displayedColumns: string[] = ['serialNo', 'player', 'match', 'goals', 'assists', 'yellowCards', 'redCards']
  isLoading = false;
  searchTerm: string = '';

  constructor(
    private playerStatsSvc: PlayerStatsService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPlayerStats();
  }

  loadPlayerStats() {
    this.isLoading = true;
    this.playerStatsSvc.getAll().subscribe({
      next: (res) => {
        this.playerStats = res;
        this.filteredPlayerStats = res;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Failed to load player statistics', 'Close', { duration: 3000 });
      }
    });
  }

  viewStats(stat: PlayerStat) {
    this.router.navigate(['/player-stats', stat.id]);
  }

  editStats(stat: PlayerStat) {
    this.router.navigate(['/player-stats/edit', stat.id]);
  }

  deleteStat(stat: PlayerStat) {
    if (confirm(`Are you sure you want to delete this player stat?`)) {
      this.playerStatsSvc.delete(stat.id).subscribe({
        next: () => {
          this.snackBar.open('Player stat deleted successfully', 'Close', { duration: 2000 });
          this.loadPlayerStats();
        },
        error: () => {
          this.snackBar.open('Failed to delete player stat', 'Close', { duration: 3000 });
        }
      });
    }
  }

  addStats() {
    this.router.navigate(['/player-stats/create']);
  }

  applyFilter() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredPlayerStats = this.playerStats;
    } else {
      this.filteredPlayerStats = this.playerStats.filter(stat =>
       stat.playerId.toString().includes(term) ||
      stat.player?.name?.toLowerCase().includes(term) ||
      stat.matchId.toString().includes(term) ||
      stat.match?.title?.toLowerCase().includes(term) ||
      stat.goals?.toString().includes(term) 
      );
    }
  }
}
