import { Component, OnInit } from '@angular/core';
import { MatchesService } from '../../../services/matches.service';
import { Match } from '../../../models/match';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TeamsService } from '../../../services/teams.service';
import { Team } from '../../../models/team';

@Component({
  selector: 'app-matches-list',
  standalone: false,
  templateUrl: './matches-list.component.html',
  styleUrls: ['./matches-list.component.css']
})
export class MatchesListComponent implements OnInit {
  matches: Match[] = [];
  filteredMatches: Match[] = [];
  displayedColumns: string[] = ['serialNo', 'homeTeam', 'awayTeam', 'matchDate', 'venue', 'actions'];
  isLoading = false;
  searchTerm: string = '';
  teamsMap: { [id: number]: Team } = {};

  constructor(
    private matchesSvc: MatchesService,
    private snackBar: MatSnackBar,
    private router: Router,
    private teamsSvc: TeamsService
  ) {}

  ngOnInit(): void {
    this.loadTeamsAndMatches();
  }

  loadTeamsAndMatches() {
    this.teamsSvc.getAllTeams().subscribe({
      next: (teams) => {
        if (Array.isArray(teams)) {
          teams.forEach((team: Team) => {
            this.teamsMap[team.id] = team;
          });
        }
        this.loadMatches();
      },
      error: () => {
        this.snackBar.open('Failed to load teams', 'Close', { duration: 3000 });
        this.loadMatches();
      }
    });
  }

  loadMatches() {
    this.isLoading = true;
    this.matchesSvc.getAll().subscribe({
      next: (res) => {
        this.matches = res;
        this.filteredMatches = res;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Failed to load matches', 'Close', { duration: 3000 });
      }
    });
  }

  getTeamNameById(id: number): string {
    return this.teamsMap[id]?.name || id.toString();
  }

  applyFilter() {
    if (!this.searchTerm) {
      this.filteredMatches = this.matches;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredMatches = this.matches.filter(match =>
      match.venue?.toLowerCase().includes(term) ||
      match.matchDate?.toLowerCase().includes(term)
    );
  }

  viewMatch(match: Match) {
    this.router.navigate(['/matches', match.id]);
  }

  editMatch(match: Match) {
    this.router.navigate(['/matches/edit', match.id]);
  }

  deleteMatch(match: Match) {
    if (confirm(`Are you sure you want to delete this match?`)) {
      this.matchesSvc.delete(match.id).subscribe({
        next: () => {
          this.snackBar.open('Match deleted successfully', 'Close', { duration: 2000 });
          this.loadMatches();
        },
        error: () => {
          this.snackBar.open('Failed to delete match', 'Close', { duration: 3000 });
        }
      });
    }
  }

  addMatch() {
    this.router.navigate(['/matches/create']);
  }
}
