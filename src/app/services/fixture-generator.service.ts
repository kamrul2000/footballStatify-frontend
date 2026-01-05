import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Fixture {
  id?: number;
  title?: string;
  teamAId: number;
  teamBId: number;
  teamA?: any;
  teamB?: any;
  matchDate: string;
  venue: string;
}

@Injectable({
  providedIn: 'root'
})
export class FixtureGeneratorService {

  constructor(private api: ApiService) {}

  generateFixtures(payload: any): Observable<any[]> {
    return this.api.post<any[]>('generate', payload);
  }
}
