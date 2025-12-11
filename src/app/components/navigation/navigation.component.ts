import { Component } from '@angular/core';

@Component({
  selector: 'app-navigation',
  standalone: false,
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/teams', label: 'Teams', icon: 'groups' },
    { path: '/players', label: 'Players', icon: 'sports_soccer' },
    { path: '/matches', label: 'Matches', icon: 'event' },
    { path: '/match-results', label: 'Match Results', icon: 'scoreboard' },
    { path: '/player-stats', label: 'Player Stats', icon: 'bar_chart' },
    { path: '/fixture-generator', label: 'Fixture Generator', icon: 'event_note' }
  ];
}
