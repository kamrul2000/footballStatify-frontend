import { Component, OnInit } from '@angular/core';
import { PlayersService } from '../../services/players.service';
import { Player } from '../../models/player';

@Component({
  selector: 'app-players-list',
  templateUrl: './players-list.component.html',
  standalone: false,
  styleUrls: ['./players-list.component.css']

})
export class PlayersListComponent implements OnInit {
  players: Player[] = [];
  loading = false;
  error = '';

  constructor(private playersSvc: PlayersService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.playersSvc.getAll().subscribe({
      next: data => { this.players = data; this.loading = false; },
      error: err => { this.error = 'Could not load players'; this.loading = false; }
    });
  }

  delete(id: number) {
    if (!confirm('Delete player?')) return;
    this.playersSvc.delete(id).subscribe({ next: () => this.load() });
  }
}
