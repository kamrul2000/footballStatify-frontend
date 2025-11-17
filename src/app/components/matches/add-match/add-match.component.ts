import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-match',
  standalone: false,
  templateUrl: './add-match.component.html',
})
export class AddMatchComponent implements OnInit {

  matchForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.matchForm = this.fb.group({
      teamAId: ['', Validators.required],
      teamBId: ['', Validators.required],
      matchDate: ['', Validators.required],
      venue: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.matchForm.valid) {
      console.log("Match Added:", this.matchForm.value);
      // Here we will later call matchesService.addMatch(...)
    }
  }
}
