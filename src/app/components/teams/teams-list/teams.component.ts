import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { TeamsService } from '../../../services/teams.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teams',
  standalone: false,
  templateUrl: './teams.component.html',
})
export class TeamsComponent implements OnInit {
  teamForm: FormGroup;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['serialNo', 'teamName', 'coach', 'foundingYear', 'actions'];
  isLoading = false;
  isEditMode = false;
  currentTeamId: number | null = null;
  teams: any[] = [];
  filteredTeams: any[] = [];
  searchTerm: string = '';

  constructor(
    private fb: FormBuilder,
    private teamsSvc: TeamsService,
    private snackBar: MatSnackBar,
     private router: Router
  ) {
    this.teamForm = this.fb.group({
      teamName: ['', Validators.required],
      coach: ['', Validators.required],
      foundedYear: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTeams();
  }

  loadTeams() {
    this.isLoading = true;
    this.teamsSvc.getAllTeams().subscribe({
      next: (res) => {
        this.teams = res;
        this.filteredTeams = res;
        this.dataSource.data = this.filteredTeams;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Failed to load teams', 'Close', { duration: 3000 });
      }
    });
  }

  onSubmit() {
    if (this.teamForm.invalid) return;

    const teamData = this.teamForm.value;

    if (this.isEditMode && this.currentTeamId) {
      teamData.id = this.currentTeamId;
      this.teamsSvc.updateTeam(teamData).subscribe({
        next: () => {
          this.snackBar.open('Team updated successfully', 'Close', { duration: 2000 });
          this.resetForm();
          this.loadTeams();
        },
        error: () => {
          this.snackBar.open('Failed to update team', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.teamsSvc.addTeam(teamData).subscribe({
        next: () => {
          this.snackBar.open('Team added successfully', 'Close', { duration: 2000 });
          this.resetForm();
          this.loadTeams();
        },
        error: () => {
          this.snackBar.open('Failed to add team', 'Close', { duration: 3000 });
        }
      });
    }
  }

  editTeam(team: any) {
    this.router.navigate(['/teams/edit', team.id]);
  }

  viewTeam(team: any) {
    this.router.navigate(['/teams', team.id]);
  }

  deleteTeam(team: any) {
    if (confirm(`Are you sure you want to delete "${team.teamName}"?`)) {
      this.teamsSvc.deleteTeam(team.id).subscribe({
        next: () => {
          this.snackBar.open('Team deleted successfully', 'Close', { duration: 2000 });
          this.loadTeams();
        },
        error: () => {
          this.snackBar.open('Failed to delete team', 'Close', { duration: 3000 });
        }
      });
    }
  }

addTeam() {
  this.router.navigateByUrl('/team');
}

  applyFilter() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredTeams = this.teams;
    } else {
      this.filteredTeams = this.teams.filter(team =>
        team.name.toLowerCase().includes(term) ||
        team.coach.toLowerCase().includes(term)
      );
    }
    this.dataSource.data = this.filteredTeams;
  }

  resetForm() {
    this.teamForm.reset();
    this.isEditMode = false;
    this.currentTeamId = null;
  }
}
