import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlayersService } from '../../../services/players.service';
import { TeamsService } from '../../../services/teams.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Team } from '../../../models/team';

@Component({
  selector: 'app-add-player',
  templateUrl: './add-player.component.html',
  standalone: false,
  styleUrls: ['./add-player.component.css']
})
export class AddPlayerComponent implements OnInit {

  form!: FormGroup;
  teams: any[] = [];
  loading = false;
  playerId: number | null = null;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private playersSvc: PlayersService,
    private teamsSvc: TeamsService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadTeams();
    
    this.playerId = this.route.snapshot.params['id'] ? +this.route.snapshot.params['id'] : null;
    if (this.playerId) {
      this.isEditMode = true;
      this.loadPlayer();
    }
    
    const teamId = this.route.snapshot.queryParams['teamId'];
    if (teamId) {
      this.form.patchValue({ teamId: +teamId });
    }
  }

  initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      position: ['', Validators.required],
      teamId: ['', Validators.required]
    });
  }

  loadTeams() {
    this.teamsSvc.getAllTeams().subscribe({
      next: (data: any) => this.teams = data,
      error: (err) => {
        this.snackBar.open('Failed to load teams', 'Close', { duration: 3000 });
      }
    });
  }

  loadPlayer() {
    this.playersSvc.getById(this.playerId!).subscribe({
      next: (player: any) => {
        this.form.patchValue({
          name: player.name,
          position: player.position,
          teamId: player.teamId
        });
      },
      error: () => {
        this.snackBar.open('Failed to load player', 'Close', { duration: 3000 });
        this.router.navigate(['/players']);
      }
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.loading = true;
    
  if (this.isEditMode && this.playerId) {
  const payload = {
    id: this.playerId,
    age: this.form.value.age,
    name: this.form.value.name,
    position: this.form.value.position,
    teamId: this.form.value.teamId
  };

  this.playersSvc.update(this.playerId, payload).subscribe({
    next: () => {
      this.snackBar.open('Player updated successfully!', 'Close', { duration: 2000 });
      this.router.navigate(['/players']);
    },
    error: (err) => {
      console.error(err);
      this.snackBar.open('Failed to update player', 'Close', { duration: 3000 });
      this.loading = false;
    }
  });
}
 else {
  this.playersSvc.create(this.form.value).subscribe({
        next: () => {
          this.snackBar.open('Player added successfully!', 'Close', { duration: 2000 });
          this.router.navigate(['/players']);
        },
        error: () => {
          this.snackBar.open('Failed to add player', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/players']);
  }
}
