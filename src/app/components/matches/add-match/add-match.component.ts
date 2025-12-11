import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatchesService } from '../../../services/matches.service';
import { TeamsService } from '../../../services/teams.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-match',
  standalone: false,
  templateUrl: './add-match.component.html',
})
export class AddMatchComponent implements OnInit {

  matchForm!: FormGroup;
  teams: any[] = [];
  isLoading = false;
  isEditMode = false;
  matchId?: number;

  constructor(
    private fb: FormBuilder,
    private matchesSvc: MatchesService,
    private teamsSvc: TeamsService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.matchForm = this.fb.group({
      homeTeamId: ['', Validators.required],
      awayTeamId: ['', Validators.required],
      matchDate: ['', Validators.required],
      venue: ['', Validators.required]
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.matchId = +params['id'];
        this.isEditMode = true;
        this.loadMatch();
      }
    });

    this.loadTeams();
  }

  loadTeams() {
    this.teamsSvc.getAllTeams().subscribe({
      next: (res) => {
        this.teams = res;
      },
      error: () => {
        this.snackBar.open('Failed to load teams', 'Close', { duration: 3000 });
      }
    });
  }

  loadMatch() {
    if (!this.matchId) return;
    
    this.matchesSvc.getById(this.matchId).subscribe({
      next: (match) => {
        this.matchForm.patchValue({
          homeTeamId: match.homeTeamId,
          awayTeamId: match.awayTeamId,
          matchDate: match.matchDate,
          venue: match.venue
        });
      },
      error: () => {
        this.snackBar.open('Failed to load match', 'Close', { duration: 3000 });
        this.router.navigate(['/matches']);
      }
    });
  }

  onSubmit() {
    if (this.matchForm.invalid) return;

    this.isLoading = true;
    const matchData = this.matchForm.value;

    if (this.isEditMode && this.matchId) {
      this.matchesSvc.update(this.matchId, matchData).subscribe({
        next: () => {
          this.snackBar.open('Match updated successfully', 'Close', { duration: 2000 });
          this.router.navigate(['/matches']);
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('Failed to update match', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.matchesSvc.create(matchData).subscribe({
        next: () => {
          this.snackBar.open('Match created successfully', 'Close', { duration: 2000 });
          this.router.navigate(['/matches']);
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('Failed to create match', 'Close', { duration: 3000 });
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/matches']);
  }
}