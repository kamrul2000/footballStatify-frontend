import { Component, OnInit } from '@angular/core';
import { TeamsService } from '../../../services/teams.service';

import { Team } from '../../../models/team';
@Component({
  selector: 'app-teams-list',
  standalone: false,
  templateUrl: './teams-list.component.html',
})
export class TeamsListComponent implements OnInit {

  teams: Team[] = [];
  loading = false;
  error = '';

  constructor(private teamsSvc: TeamsService) {}

  ngOnInit(): void {
    this.loadTeams();
  }

  loadTeams() {
    this.loading = true;
    this.teamsSvc.getAll().subscribe({
      next: data => { this.teams = data; this.loading = false; },
      error: err => { this.error = 'Could not load teams'; this.loading = false; }
    });
  }

  delete(id: number) {
    if (!confirm('Delete this team?')) return;
    this.teamsSvc.delete(id).subscribe({
      next: () => this.loadTeams()
    });
  }
}
