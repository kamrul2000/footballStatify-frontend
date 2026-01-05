import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatchResultsService } from '../../../services/match-results.service';
import { MatchesService } from '../../../services/matches.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-match-result',
  standalone: false,
  templateUrl: './add-match-result.component.html',
  styleUrls: ['./add-match-result.component.css']
})
export class AddMatchResultComponent implements OnInit {
  resultForm!: FormGroup;
  matches: any[] = [];
  isLoading = false;
  isEditMode = false;
  resultId?: number;


  constructor(
    private fb: FormBuilder,
    private matchResultsSvc: MatchResultsService,
    private matchesSvc: MatchesService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.resultForm = this.fb.group({
      matchId: ['', Validators.required],
      teamAGoals: [0, [Validators.required, Validators.min(0)]],
      teamBGoals: [0, [Validators.required, Validators.min(0)]]
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.resultId = +params['id'];
        this.isEditMode = true;
        this.loadResult();
      }
    });

    this.loadMatches();
  }

  loadMatches() {
    this.matchesSvc.getAll().subscribe({
      next: (res) => {
        this.matches = res;
      },
      error: () => {
        this.snackBar.open('Failed to load matches', 'Close', { duration: 3000 });
      }
    });
  }

  loadResult() {
    if (!this.resultId) return;
    
    this.matchResultsSvc.getById(this.resultId).subscribe({
      next: (result) => {
        this.resultForm.patchValue({
          matchId: result.matchId,
          teamAGoals: result.teamAGoals,
          teamBGoals: result.teamBGoals
        });
      },
      error: () => {
        this.snackBar.open('Failed to load match result', 'Close', { duration: 3000 });
        this.router.navigate(['/match-results']);
      }
    });
  }

  onSubmit() {
    if (this.resultForm.invalid) return;

    this.isLoading = true;
    const resultData = this.resultForm.value;

    if (this.isEditMode && this.resultId) {
      this.matchResultsSvc.update(this.resultId, resultData).subscribe({
        next: () => {
          this.snackBar.open('Match result updated successfully', 'Close', { duration: 2000 });
          this.router.navigate(['/match-results']);
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('Failed to update match result', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.matchResultsSvc.create(resultData).subscribe({
        next: () => {
          this.snackBar.open('Match result created successfully', 'Close', { duration: 2000 });
          this.router.navigate(['/match-results']);
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('Failed to create match result', 'Close', { duration: 3000 });
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/match-results']);
  }
}
