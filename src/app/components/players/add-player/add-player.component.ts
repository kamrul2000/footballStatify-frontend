import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlayersService } from '../../../services/players.service';
import { TeamsService } from '../../../services/teams.service';
import { Router } from '@angular/router';
import { Team } from '../../../models/team';

@Component({
  selector: 'app-add-player',
  templateUrl: './add-player.component.html',
  standalone: false,
  styleUrls: ['./add-player.component.css']
})
export class AddPlayerComponent implements OnInit {

  form!: FormGroup;
  teams: Team[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private playersSvc: PlayersService,
    private teamsSvc: TeamsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadTeams();
  }

  initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      position: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(10), Validators.max(50)]],
      teamId: ['', Validators.required]
    });
  }

  loadTeams() {
    this.teamsSvc.getAll().subscribe({
      next: data => this.teams = data,
      error: () => alert("Could not load teams")
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.playersSvc.create(this.form.value).subscribe({
      next: () => {
        alert("Player added successfully!");
        this.router.navigate(['/players']);
      },
      error: () => {
        alert("Failed to add player.");
        this.loading = false;
      }
    });
  }
}
