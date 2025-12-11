import { Component, OnInit } from '@angular/core';
import { TeamsService } from '../../services/teams.service';
import { PlayersService } from '../../services/players.service';
import { MatchesService } from '../../services/matches.service';
import { PlayerStatsService } from '../../services/player-stats.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats = {
    totalTeams: 0,
    totalPlayers: 0,
    totalMatches: 0,
    totalGoals: 0
  };
  
  recentMatches: any[] = [];
  topScorers: any[] = [];
  isLoading = true;

  constructor(
    private teamsSvc: TeamsService,
    private playersSvc: PlayersService,
    private matchesSvc: MatchesService,
    private playerStatsSvc: PlayerStatsService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;

    // Load teams count
    this.teamsSvc.getAllTeams().subscribe({
      next: (teams) => {
        this.stats.totalTeams = teams.length;
      },
      error: () => {}
    });

    // Load players count
    this.playersSvc.getAll().subscribe({
      next: (players) => {
        this.stats.totalPlayers = players.length;
      },
      error: () => {}
    });

    // Load matches
    this.matchesSvc.getAll().subscribe({
      next: (matches) => {
        this.stats.totalMatches = matches.length;
        // Get 5 most recent matches
        this.recentMatches = matches
          .sort((a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime())
          .slice(0, 5);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });

    // Load player stats to calculate goals
    this.playerStatsSvc.getAll().subscribe({
      next: (stats) => {
        this.stats.totalGoals = stats.reduce((sum, stat) => sum + (stat.goals || 0), 0);
        
        // Calculate top scorers
        const playerGoals = new Map<number, number>();
        stats.forEach(stat => {
          const current = playerGoals.get(stat.playerId) || 0;
          playerGoals.set(stat.playerId, current + (stat.goals || 0));
        });
        
        this.topScorers = Array.from(playerGoals.entries())
          .map(([playerId, goals]) => ({ playerId, goals }))
          .sort((a, b) => b.goals - a.goals)
          .slice(0, 5);
      },
      error: () => {}
    });
  }
}
