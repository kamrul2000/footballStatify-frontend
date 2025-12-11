import { Injectable } from '@angular/core';

export interface Team {
  id: number;
  name: string;
}

export interface Fixture {
  round: number;
  homeTeam: Team;
  awayTeam: Team;
  date: Date;
  venue: string;
  group?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FixtureGeneratorService {

  constructor() { }

  /**
   * Generate round-robin fixtures for a single group
   */
  generateRoundRobin(
    teams: Team[],
    startDate: Date,
    venues: string[],
    matchesPerDay: number = 2
  ): Fixture[] {
    const fixtures: Fixture[] = [];
    const n = teams.length;
    
    if (n < 2) return fixtures;

    // For odd number of teams, add a "bye" team
    const teamsArray = [...teams];
    if (n % 2 === 1) {
      teamsArray.push({ id: -1, name: 'BYE' });
    }

    const totalTeams = teamsArray.length;
    const rounds = totalTeams - 1;
    const matchesPerRound = totalTeams / 2;

    let currentDate = new Date(startDate);
    let matchesScheduledToday = 0;
    let venueIndex = 0;
    let roundNumber = 1;

    // Round-robin algorithm
    for (let round = 0; round < rounds; round++) {
      for (let match = 0; match < matchesPerRound; match++) {
        let home: number, away: number;

        if (match === 0) {
          home = 0;
          away = totalTeams - 1 - round;
        } else {
          home = (round + match) % (totalTeams - 1);
          away = (totalTeams - 1 - match - round) % (totalTeams - 1);
        }

        // Skip if BYE team is involved
        if (teamsArray[home].id === -1 || teamsArray[away].id === -1) {
          continue;
        }

        fixtures.push({
          round: roundNumber,
          homeTeam: teamsArray[home],
          awayTeam: teamsArray[away],
          date: new Date(currentDate),
          venue: venues[venueIndex % venues.length]
        });

        venueIndex++;
        matchesScheduledToday++;

        // Move to next day if we've scheduled enough matches
        if (matchesScheduledToday >= matchesPerDay) {
          currentDate.setDate(currentDate.getDate() + 1);
          matchesScheduledToday = 0;
        }
      }
      roundNumber++;
    }

    return fixtures;
  }

  /**
   * Generate fixtures for multiple groups (group stage)
   */
  generateGroupStage(
    teams: Team[],
    numberOfGroups: number,
    startDate: Date,
    venues: string[],
    matchesPerDay: number = 2
  ): Fixture[] {
    const fixtures: Fixture[] = [];
    
    // Distribute teams into groups
    const groups = this.distributeTeamsIntoGroups(teams, numberOfGroups);
    
    let currentDate = new Date(startDate);
    let matchesScheduledToday = 0;
    let venueIndex = 0;

    // Generate fixtures for each group
    groups.forEach((groupTeams, groupIndex) => {
      const groupName = String.fromCharCode(65 + groupIndex); // A, B, C, etc.
      const n = groupTeams.length;
      
      if (n < 2) return;

      const teamsArray = [...groupTeams];
      if (n % 2 === 1) {
        teamsArray.push({ id: -1, name: 'BYE' });
      }

      const totalTeams = teamsArray.length;
      const rounds = totalTeams - 1;
      const matchesPerRound = totalTeams / 2;
      let roundNumber = 1;

      for (let round = 0; round < rounds; round++) {
        for (let match = 0; match < matchesPerRound; match++) {
          let home: number, away: number;

          if (match === 0) {
            home = 0;
            away = totalTeams - 1 - round;
          } else {
            home = (round + match) % (totalTeams - 1);
            away = (totalTeams - 1 - match - round) % (totalTeams - 1);
          }

          if (teamsArray[home].id === -1 || teamsArray[away].id === -1) {
            continue;
          }

          fixtures.push({
            round: roundNumber,
            homeTeam: teamsArray[home],
            awayTeam: teamsArray[away],
            date: new Date(currentDate),
            venue: venues[venueIndex % venues.length],
            group: groupName
          });

          venueIndex++;
          matchesScheduledToday++;

          if (matchesScheduledToday >= matchesPerDay) {
            currentDate.setDate(currentDate.getDate() + 1);
            matchesScheduledToday = 0;
          }
        }
        roundNumber++;
      }
    });

    return fixtures;
  }

  /**
   * Distribute teams into groups evenly
   */
  private distributeTeamsIntoGroups(teams: Team[], numberOfGroups: number): Team[][] {
    const groups: Team[][] = Array.from({ length: numberOfGroups }, () => []);
    
    teams.forEach((team, index) => {
      groups[index % numberOfGroups].push(team);
    });

    return groups;
  }

  /**
   * Generate knockout stage fixtures
   */
  generateKnockout(
    teams: Team[],
    startDate: Date,
    venues: string[]
  ): Fixture[] {
    const fixtures: Fixture[] = [];
    let currentDate = new Date(startDate);
    let roundNumber = 1;
    let venueIndex = 0;
    
    const rounds = Math.ceil(Math.log2(teams.length));
    let currentTeams = [...teams];

    for (let round = 0; round < rounds; round++) {
      const matchesInRound = Math.floor(currentTeams.length / 2);
      
      for (let i = 0; i < matchesInRound; i++) {
        fixtures.push({
          round: roundNumber,
          homeTeam: currentTeams[i * 2],
          awayTeam: currentTeams[i * 2 + 1],
          date: new Date(currentDate),
          venue: venues[venueIndex % venues.length]
        });
        venueIndex++;
      }

      roundNumber++;
      currentDate.setDate(currentDate.getDate() + 3); // 3 days between knockout rounds
      currentTeams = currentTeams.slice(0, matchesInRound); // Winners advance (placeholder)
    }

    return fixtures;
  }
}
