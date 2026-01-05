import { Component, OnInit } from '@angular/core';
import { PlayersService } from '../../services/players.service';
import { Player } from '../../models/player';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TeamsService } from '../../services/teams.service';
@Component({
  selector: 'app-players-list',
  templateUrl: './players-list.component.html',
  standalone: false,
  styleUrls: ['./players-list.component.css']

})
export class PlayersListComponent implements OnInit {
  players: Player[] = [];
  filteredPlayers: Player[] = [];
  displayedColumns: string[] = ['serialNo', 'name', 'position', 'team', 'actions'];
  loading = false;
  error = '';
  searchTerm: string = '';
teams: any[] = [];

  constructor(
    private playersSvc: PlayersService,
    private teamsSvc: TeamsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.load();
    this.loadTeams();
  }
 
  loadTeams() {
    this.teamsSvc.getAllTeams().subscribe({
      next: (data: any) => this.teams = data,
      error: (err) => {
        this.snackBar.open('Failed to load teams', 'Close', { duration: 3000 });
      }
    });
  }
  load() {
    this.loading = true;
    this.playersSvc.getAll().subscribe({
      next: data => { 
        this.players = data;
        this.filteredPlayers = data;
        this.loading = false; 
      },
      error: err => { 
        this.error = 'Could not load players'; 
        this.loading = false;
        this.snackBar.open('Failed to load players', 'Close', { duration: 3000 });
      }
    });
  }

  applyFilter() {
    if (!this.searchTerm) {
      this.filteredPlayers = this.players;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredPlayers = this.players.filter(player =>
      player.name?.toLowerCase().includes(term) ||
      player.position?.toLowerCase().includes(term)
    );
  }
getTeamName(teamId: number): string {
  const team = this.teams.find(t => t.id === teamId);
  return team ? team.name : 'Unknown';
}

  delete(id: number) {
    if (!confirm('Delete player?')) return;
    this.playersSvc.delete(id).subscribe({ 
      next: () => {
        this.snackBar.open('Player deleted successfully', 'Close', { duration: 2000 });
        this.load();
      },
      error: () => {
        this.snackBar.open('Failed to delete player', 'Close', { duration: 3000 });
      }
    });
  }
}
