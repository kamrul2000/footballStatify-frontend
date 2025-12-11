import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlayerStatsService } from '../../../services/player-stats.service';
import { PlayersService } from '../../../services/players.service';
import { MatchesService } from '../../../services/matches.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-player-stats',
  standalone: false,
  templateUrl: './add-player-stats.component.html',
  styleUrls: ['./add-player-stats.component.css']
})
export class AddPlayerStatsComponent implements OnInit {
  statsForm!: FormGroup;
  players: any[] = [];
  matches: any[] = [];
  isLoading = false;
  isEditMode = false;
  statId?: number;

  constructor(
    private fb: FormBuilder,
    private playerStatsSvc: PlayerStatsService,
    private playersSvc: PlayersService,
    private matchesSvc: MatchesService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.statsForm = this.fb.group({
      playerId: ['', Validators.required],
      matchId: ['', Validators.required],
      goals: [0, [Validators.required, Validators.min(0)]],
      assists: [0, [Validators.required, Validators.min(0)]],
      yellowCards: [0, [Validators.required, Validators.min(0), Validators.max(2)]],
      redCards: [0, [Validators.required, Validators.min(0), Validators.max(1)]]
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.statId = +params['id'];
        this.isEditMode = true;
        this.loadStat();
      }
    });

    this.loadPlayers();
    this.loadMatches();
  }

  loadPlayers() {
    this.playersSvc.getAll().subscribe({
      next: (res) => {
        this.players = res;
      },
      error: () => {
        this.snackBar.open('Failed to load players', 'Close', { duration: 3000 });
      }
    });
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

  loadStat() {
    if (!this.statId) return;
    
    this.playerStatsSvc.getById(this.statId).subscribe({
      next: (stat) => {
        this.statsForm.patchValue({
          playerId: stat.playerId,
          matchId: stat.matchId,
          goals: stat.goals
        });
      },
      error: () => {
        this.snackBar.open('Failed to load player stat', 'Close', { duration: 3000 });
        this.router.navigate(['/player-stats']);
      }
    });
  }

  onSubmit() {
    if (this.statsForm.invalid) return;

    this.isLoading = true;
    const statsData = this.statsForm.value;

    if (this.isEditMode && this.statId) {
      this.playerStatsSvc.update(this.statId, statsData).subscribe({
        next: () => {
          this.snackBar.open('Player stats updated successfully', 'Close', { duration: 2000 });
          this.router.navigate(['/player-stats']);
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('Failed to update player stats', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.playerStatsSvc.create(statsData).subscribe({
        next: () => {
          this.snackBar.open('Player stats created successfully', 'Close', { duration: 2000 });
          this.router.navigate(['/player-stats']);
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('Failed to create player stats', 'Close', { duration: 3000 });
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/player-stats']);
  }
}
