import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { FixtureGeneratorService, Fixture, Team } from '../../services/fixture-generator.service';
import { TeamsService } from '../../services/teams.service';
import { MatchesService } from '../../services/matches.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fixture-generator',
  standalone: false,
  templateUrl: './fixture-generator.component.html',
  styleUrls: ['./fixture-generator.component.css']
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

    // Watch tournament type changes
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
    
    // Prepare teams
    const selectedTeamIds = formValue.selectedTeams;
    const teams: Team[] = this.availableTeams
      .filter(t => selectedTeamIds.includes(t.id))
      .map(t => ({ id: t.id, name: t.name }));

    if (teams.length < 2) {
      this.snackBar.open('Please select at least 2 teams', 'Close', { duration: 3000 });
      this.isGenerating = false;
      return;
    }

    // Prepare venues
    const venues = formValue.venues.map((v: any) => v.name).filter((v: string) => v.trim() !== '');
    
    if (venues.length === 0) {
      this.snackBar.open('Please add at least one venue', 'Close', { duration: 3000 });
      this.isGenerating = false;
      return;
    }

    const startDate = new Date(formValue.startDate);
    const matchesPerDay = formValue.matchesPerDay;

    // Generate fixtures based on tournament type
    try {
      switch (formValue.tournamentType) {
        case 'single':
          this.generatedFixtures = this.fixtureGenerator.generateRoundRobin(
            teams, startDate, venues, matchesPerDay
          );
          break;
        case 'multiple':
          this.generatedFixtures = this.fixtureGenerator.generateGroupStage(
            teams, formValue.numberOfGroups, startDate, venues, matchesPerDay
          );
          break;
        case 'knockout':
          this.generatedFixtures = this.fixtureGenerator.generateKnockout(
            teams, startDate, venues
          );
          break;
      }

      this.showFixtures = true;
      this.snackBar.open(
        `${this.generatedFixtures.length} fixtures generated successfully!`,
        'Close',
        { duration: 2000 }
      );
    } catch (error) {
      this.snackBar.open('Failed to generate fixtures', 'Close', { duration: 3000 });
    } finally {
      this.isGenerating = false;
    }
  }

  saveFixtures() {
    if (this.generatedFixtures.length === 0) {
      return;
    }

    this.isSaving = true;
    let savedCount = 0;
    let errorCount = 0;

    // Save each fixture as a match
    this.generatedFixtures.forEach((fixture, index) => {
      const matchData = {
        homeTeamId: fixture.homeTeam.id,
        awayTeamId: fixture.awayTeam.id,
        matchDate: fixture.date.toISOString(),
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

  getGroupedFixtures(): Map<string, Fixture[]> {
    const grouped = new Map<string, Fixture[]>();
    
    this.generatedFixtures.forEach(fixture => {
      const key = fixture.group || 'Main';
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(fixture);
    });

    return grouped;
  }

  getRoundGroupedFixtures(fixtures: Fixture[]): Map<number, Fixture[]> {
    const grouped = new Map<number, Fixture[]>();
    
    fixtures.forEach(fixture => {
      if (!grouped.has(fixture.round)) {
        grouped.set(fixture.round, []);
      }
      grouped.get(fixture.round)!.push(fixture);
    });

    return grouped;
  }
}
