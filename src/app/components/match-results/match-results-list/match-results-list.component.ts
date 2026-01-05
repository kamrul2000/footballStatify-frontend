import { Component, OnInit } from '@angular/core';
import { MatchResultsService } from '../../../services/match-results.service';
import { MatchResult } from '../../../models/match-result';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-match-results-list',
  standalone: false,
  templateUrl: './match-results-list.component.html',
  styleUrls: ['./match-results-list.component.css']
})
export class MatchResultsListComponent implements OnInit {
  matchResults: MatchResult[] = [];
  filteredMatchResults: MatchResult[] = [];
  displayedColumns: string[] = ['serialNo', 'match', 'teamA', 'teamB', 'teamAGoals', 'teamBGoals', 'winner', 'actions'];
  isLoading = false;
  searchTerm: string = '';

  constructor(
    private matchResultsSvc: MatchResultsService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMatchResults();
  }

  loadMatchResults() {
    this.isLoading = true;
    this.matchResultsSvc.getAll().subscribe({
      next: (res) => {
        this.matchResults = res;
        this.filteredMatchResults = res;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Failed to load match results', 'Close', { duration: 3000 });
      }
    });
  }

  viewResult(result: MatchResult) {
    this.router.navigate(['/match-results', result.id]);
  }

  editResult(result: MatchResult) {
    this.router.navigate(['/match-results/edit', result.id]);
  }

  deleteResult(result: MatchResult) {
    if (confirm(`Are you sure you want to delete this match result?`)) {
      this.matchResultsSvc.delete(result.id).subscribe({
        next: () => {
          this.snackBar.open('Match result deleted successfully', 'Close', { duration: 2000 });
          this.loadMatchResults();
        },
        error: () => {
          this.snackBar.open('Failed to delete match result', 'Close', { duration: 3000 });
        }
      });
    }
  }

  addResult() {
    this.router.navigate(['/match-results/create']);
  }

  applyFilter() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredMatchResults = this.matchResults;
    } else {
      this.filteredMatchResults = this.matchResults.filter(result =>
        result.matchId.toString().includes(term) ||
        this.getWinnerText(result).toLowerCase().includes(term)
      );
    }
  }

  getWinnerText(result: MatchResult): string {
    if (result.homeScore > result.awayScore) {
      return `Home Team (${result.homeScore}-${result.awayScore})`;
    } else if (result.awayScore > result.homeScore) {
      return `Away Team (${result.awayScore}-${result.homeScore})`;
    } else {
      return `Draw (${result.homeScore}-${result.awayScore})`;
    }
  }
}
