import { Match } from "./types";

export const MOCK_MATCHES: Match[] = [
  {
    id: 'm1',
    sport: 'Soccer',
    league: 'Premier League',
    homeTeam: 'Arsenal',
    awayTeam: 'Liverpool',
    startTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    status: 'Upcoming',
    odds: { home: 2.45, draw: 3.40, away: 2.80 }
  },
  {
    id: 'm2',
    sport: 'Soccer',
    league: 'La Liga',
    homeTeam: 'Real Madrid',
    awayTeam: 'Barcelona',
    startTime: new Date(Date.now() - 1800000).toISOString(), // 30 mins ago
    status: 'Live',
    score: { home: 1, away: 1 },
    odds: { home: 3.10, draw: 2.90, away: 2.50 }
  },
  {
    id: 'm3',
    sport: 'Basketball',
    league: 'NBA',
    homeTeam: 'Lakers',
    awayTeam: 'Warriors',
    startTime: new Date(Date.now() + 7200000).toISOString(),
    status: 'Upcoming',
    odds: { home: 1.85, away: 1.95 }
  },
  {
    id: 'm4',
    sport: 'Tennis',
    league: 'Wimbledon',
    homeTeam: 'Alcaraz',
    awayTeam: 'Djokovic',
    startTime: new Date().toISOString(),
    status: 'Live',
    score: { home: 2, away: 1 },
    odds: { home: 1.50, away: 2.60 }
  },
  {
    id: 'm5',
    sport: 'Esports',
    league: 'LCK Summer',
    homeTeam: 'T1',
    awayTeam: 'Gen.G',
    startTime: new Date(Date.now() + 86400000).toISOString(),
    status: 'Upcoming',
    odds: { home: 2.10, away: 1.70 }
  }
];

export const INITIAL_BALANCE = 1000.00;
