import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html', // <-- must match this file
  styleUrls: ['./app.component.css'],
  standalone: false  // Explicitly set to false
})
export class AppComponent {
  title = 'football-frontend';
}