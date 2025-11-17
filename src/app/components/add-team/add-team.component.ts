import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-team',
  standalone: false,
  templateUrl: './add-team.component.html',
})
export class AddTeamComponent implements OnInit {
  
  teamForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.teamForm = this.fb.group({
      teamName: ['', Validators.required],
      coach: ['', Validators.required],
      foundedYear: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.teamForm.valid) {
      console.log("Team Added:", this.teamForm.value);
    }
  }
}
