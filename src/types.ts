export interface Candy {
  type: string;
  isMatched: boolean;
  matchType?: 'normal' | 'line' | 'cross' | 'mega';
}

export interface Match {
  row: number;
  col: number;
  matchType: 'normal' | 'line' | 'cross' | 'mega';
}

export interface Level {
  number: number;
  targetScore: number;
  moves: number;
  specialGoal?: {
    type: string;
    count: number;
  };
  background: string;
}