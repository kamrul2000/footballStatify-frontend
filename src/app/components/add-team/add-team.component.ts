import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamsService } from '../../services/teams.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Team } from '../../models/team';

@Component({
  selector: 'app-add-team',
  standalone: false,
  templateUrl: './add-team.component.html'
})
export class AddTeamComponent implements OnInit {
  teamForm!: FormGroup;
  teamId: number | null = null;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private teamsService: TeamsService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Initialize the form
    this.teamForm = this.fb.group({
      teamName: ['', Validators.required],
      coach: ['', Validators.required],
      foundedYear: ['', Validators.required]
    });

    // Check for ID in route for edit
    this.teamId = this.route.snapshot.params['id'] ? +this.route.snapshot.params['id'] : null;
    if (this.teamId) {
      this.isEditMode = true;
      this.loadTeam();
    }
  }

  loadTeam() {
    this.teamsService.getTeamById(this.teamId!).subscribe({
      next: (team: any) => {
        this.teamForm.patchValue({
          teamName: team.name,
          coach: team.coach,
          foundedYear: team.foundingYear || team.foundedYear
        });
      },
      error: (err) => {
        this.snackBar.open('Failed to load team', 'Close', { duration: 3000 });
        this.router.navigate(['/teams']);
      }
    });
  }

  onSubmit() {
    if (this.teamForm.invalid) return;

    // Prepare team data
    const teamData: Team = {
      name: this.teamForm.value.teamName,
      coach: this.teamForm.value.coach,
      foundingYear: this.teamForm.value.foundedYear,
      id: 0
    };

    if (this.isEditMode && this.teamId) {
      teamData.id = this.teamId;
      this.teamsService.updateTeam(teamData).subscribe({
        next: () => {
          this.snackBar.open('Team updated successfully', 'Close', { duration: 2000 });
          this.router.navigate(['/teams']);
        },
        error: () => this.snackBar.open('Failed to update team', 'Close', { duration: 3000 })
      });
    } else {
      this.teamsService.addTeam(teamData).subscribe({
        next: () => {
          this.snackBar.open('Team added successfully', 'Close', { duration: 2000 });
          this.router.navigate(['/teams']);
        },
        error: () => this.snackBar.open('Failed to add team', 'Close', { duration: 3000 })
      });
    }
  }
}
