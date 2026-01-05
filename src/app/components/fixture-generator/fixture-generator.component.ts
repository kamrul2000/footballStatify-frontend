import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FixtureGeneratorService, Fixture } from '../../services/fixture-generator.service';
import { TeamsService } from '../../services/teams.service';
import { MatchesService } from '../../services/matches.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common'; // <-- Add this import

@Component({
  selector: 'app-fixture-generator',
  templateUrl: './fixture-generator.component.html',
  styleUrls: ['./fixture-generator.component.css'],
  // If you use standalone: true, add imports here, otherwise remove this line
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class FixtureGeneratorComponent implements OnInit {
  generatorForm!: FormGroup;
  availableTeams: any[] = [];
  generatedFixtures: Fixture[] = [];
  isGenerating = false;
  isSaving = false;
  showFixtures = false;

  tournamentTypes = [
    { value: 'single', label: 'Single Group Round Robin' },
    { value: 'multiple', label: 'Multiple Groups' },
    { value: 'knockout', label: 'Knockout Stage' }
  ];

  constructor(
    private fb: FormBuilder,
    private fixtureGenerator: FixtureGeneratorService,
    private teamsService: TeamsService,
    private matchesService: MatchesService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadTeams();
  }

  initializeForm() {
    this.generatorForm = this.fb.group({
      tournamentType: ['single', Validators.required],
      numberOfGroups: [2, [Validators.required, Validators.min(2), Validators.max(8)]],
      selectedTeams: [[], Validators.required],
      startDate: [new Date().toISOString().split('T')[0], Validators.required],
      matchesPerDay: [2, [Validators.required, Validators.min(1), Validators.max(10)]],
      venues: this.fb.array([this.createVenueControl()])
    });

    this.generatorForm.get('tournamentType')?.valueChanges.subscribe(type => {
      if (type === 'multiple') {
        this.generatorForm.get('numberOfGroups')?.enable();
      } else {
        this.generatorForm.get('numberOfGroups')?.disable();
      }
    });
  }

  createVenueControl(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required]
    });
  }

  get venues(): FormArray {
    return this.generatorForm.get('venues') as FormArray;
  }

  addVenue() {
    this.venues.push(this.createVenueControl());
  }

  removeVenue(index: number) {
    if (this.venues.length > 1) {
      this.venues.removeAt(index);
    }
  }

  loadTeams() {
    this.teamsService.getAllTeams().subscribe({
      next: (teams) => {
        this.availableTeams = teams;
      },
      error: () => {
        this.snackBar.open('Failed to load teams', 'Close', { duration: 3000 });
      }
    });
  }

  generateFixtures() {
    if (this.generatorForm.invalid) {
      this.snackBar.open('Please fill all required fields', 'Close', { duration: 3000 });
      return;
    }

    this.isGenerating = true;
    const formValue = this.generatorForm.value;

    const payload = {
      teamIds: formValue.selectedTeams,
      matchesPerDay: formValue.matchesPerDay,
      tournamentStartDate: new Date(formValue.startDate).toISOString(),
      firstMatchStartTime: "10:00:00",
      matchDuration: "02:00:00",
      venues: formValue.venues.map((v: any) => v.name).filter((v: string) => v.trim() !== ''),
      tournamentType: formValue.tournamentType === 'single' ? 1 : formValue.tournamentType === 'multiple' ? 2 : 3,
      teamsPerGroup: formValue.numberOfGroups || 3
    };

    this.fixtureGenerator.generateFixtures(payload).subscribe({
      next: (fixtures) => {
        this.generatedFixtures = fixtures;
        this.showFixtures = true;
        this.snackBar.open(`${fixtures.length} fixtures generated successfully!`, 'Close', { duration: 2000 });
      },
      error: () => {
        this.snackBar.open('Failed to generate fixtures', 'Close', { duration: 3000 });
      },
      complete: () => {
        this.isGenerating = false;
      }
    });
  }

  getTeamNameById(id: number): string {
    const team = this.availableTeams.find(t => t.id === id);
    return team ? team.name : `Team ${id}`;
  }

  reset() {
    this.generatedFixtures = [];
    this.showFixtures = false;
    this.generatorForm.reset({
      tournamentType: 'single',
      numberOfGroups: 2,
      selectedTeams: [],
      startDate: new Date().toISOString().split('T')[0],
      matchesPerDay: 2
    });
    this.venues.clear();
    this.addVenue();
  }

  saveFixtures() {
    if (this.generatedFixtures.length === 0) {
      this.snackBar.open('No fixtures to save.', 'Close', { duration: 2000 });
      return;
    }

    this.isSaving = true;
    let savedCount = 0;
    let errorCount = 0;

    this.generatedFixtures.forEach((fixture, index) => {
      const matchData = {
        homeTeamId: fixture.teamAId,
        awayTeamId: fixture.teamBId,
        matchDate: fixture.matchDate,
        venue: fixture.venue
      };

      this.matchesService.create(matchData).subscribe({
        next: () => {
          savedCount++;
          if (savedCount + errorCount === this.generatedFixtures.length) {
            this.handleSaveComplete(savedCount, errorCount);
          }
        },
        error: () => {
          errorCount++;
          if (savedCount + errorCount === this.generatedFixtures.length) {
            this.handleSaveComplete(savedCount, errorCount);
          }
        }
      });
    });
  }

  handleSaveComplete(savedCount: number, errorCount: number) {
    this.isSaving = false;
    if (errorCount === 0) {
      this.snackBar.open(
        `All ${savedCount} fixtures saved successfully!`,
        'Close',
        { duration: 3000 }
      );
      this.router.navigate(['/matches']);
    } else {
      this.snackBar.open(
        `Saved ${savedCount} fixtures. ${errorCount} failed.`,
        'Close',
        { duration: 4000 }
      );
    }
  }
}
