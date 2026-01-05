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
      title: ['', Validators.required],
      TeamAId: ['', Validators.required],
      TeamBId: ['', Validators.required],
      matchDate: ['', Validators.required],
      matchTime: [''],
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
  title: match.title,
  TeamAId: match.teamAId,
  TeamBId: match.teamBId,
  matchDate: new Date(match.matchDate),
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

  const date: Date = new Date(this.matchForm.value.matchDate);
  const time = this.matchForm.value.matchTime;

  if (time) {
    const [hours, minutes] = time.split(':');
    date.setHours(+hours, +minutes, 0, 0);
  }

  const teamA = this.teams.find(t => t.id === this.matchForm.value.TeamAId);
  const teamB = this.teams.find(t => t.id === this.matchForm.value.TeamBId);

  const payload = {
    id: this.matchId ?? 0,
    title: this.matchForm.value.title,
    teamAId: this.matchForm.value.TeamAId,
    teamBId: this.matchForm.value.TeamBId,
    teamA: teamA,
    teamB: teamB,
    matchDate: date.toISOString(),
    venue: this.matchForm.value.venue,
    homeTeamId: this.matchForm.value.TeamAId,
    awayTeamId: this.matchForm.value.TeamBId
  };

  if (this.isEditMode && this.matchId) {
    this.matchesSvc.update(this.matchId, payload).subscribe({
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
    this.matchesSvc.create(payload).subscribe({
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