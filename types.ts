export enum ViewState {
  HOME = 'HOME',
  AVETOR = 'AVETOR', // The crash game
  HISTORY = 'HISTORY',
  PROFILE = 'PROFILE',
  AUTH = 'AUTH'
}

export interface User {
  id: string;
  username: string;
  balance: number;
}

export interface Match {
  id: string;
  sport: 'Soccer' | 'Basketball' | 'Tennis' | 'Esports';
  league: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  status: 'Live' | 'Upcoming' | 'Ended';
  odds: {
    home: number;
    draw?: number;
    away: number;
  };
  score?: {
    home: number;
    away: number;
  };
}

export interface BetSlipItem {
  id: string; // usually matchId + selection
  matchId: string;
  selection: 'home' | 'draw' | 'away';
  odds: number;
  match: Match;
  stake: number;
}

export interface BetHistoryItem {
  id: string;
  type: 'Sports' | 'Avetor';
  detail: string;
  stake: number;
  multiplier: number;
  payout: number; // 0 if lost
  timestamp: Date;
  status: 'Won' | 'Lost' | 'Pending';
}
