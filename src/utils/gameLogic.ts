import { Candy, Match } from '../types';

export function createBoard(size: number, candyTypes: string[]): Candy[][] {
  const board: Candy[][] = [];
  
  for (let row = 0; row < size; row++) {
    board[row] = [];
    for (let col = 0; col < size; col++) {
      let validTypes = [...candyTypes];
      
      // Remove types that would create initial matches
      if (row >= 2) {
        if (board[row-1][col].type === board[row-2][col].type) {
          validTypes = validTypes.filter(type => type !== board[row-1][col].type);
        }
      }
      if (col >= 2) {
        if (board[row][col-1].type === board[row][col-2].type) {
          validTypes = validTypes.filter(type => type !== board[row][col-1].type);
        }
      }
      
      board[row][col] = {
        type: validTypes[Math.floor(Math.random() * validTypes.length)],
        isMatched: false
      };
    }
  }
  
  return board;
}

export function checkForMatches(board: Candy[][]): Match[] {
  const matches: Match[] = [];
  const size = board.length;
  const matchedPositions = new Set<string>();

  // Helper to add match to the list
  const addMatch = (row: number, col: number, matchType: 'normal' | 'line' | 'cross' | 'mega') => {
    const key = `${row},${col}`;
    if (!matchedPositions.has(key)) {
      matchedPositions.add(key);
      matches.push({ row, col, matchType });
    }
  };

  // Check horizontal matches
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size - 2; col++) {
      if (!board[row][col].type) continue;
      
      let matchLength = 1;
      while (col + matchLength < size && 
             board[row][col].type === board[row][col + matchLength].type) {
        matchLength++;
      }
      
      if (matchLength >= 3) {
        const matchType = matchLength >= 5 ? 'mega' : 
                         matchLength === 4 ? 'line' : 'normal';
        
        for (let i = 0; i < matchLength; i++) {
          addMatch(row, col + i, matchType);
        }
      }
    }
  }

  // Check vertical matches
  for (let col = 0; col < size; col++) {
    for (let row = 0; row < size - 2; row++) {
      if (!board[row][col].type) continue;
      
      let matchLength = 1;
      while (row + matchLength < size && 
             board[row][col].type === board[row + matchLength][col].type) {
        matchLength++;
      }
      
      if (matchLength >= 3) {
        const matchType = matchLength >= 5 ? 'mega' : 
                         matchLength === 4 ? 'line' : 'normal';
        
        for (let i = 0; i < matchLength; i++) {
          addMatch(row + i, col, matchType);
        }
      }
    }
  }

  // Check for cross matches (T or L shapes)
  matches.forEach(match => {
    const { row, col } = match;
    const candyType = board[row][col].type;
    
    // Check for T or L shape
    const hasVertical = row + 2 < size &&
                       board[row + 1][col].type === candyType &&
                       board[row + 2][col].type === candyType;
    
    const hasHorizontal = col + 2 < size &&
                         board[row][col + 1].type === candyType &&
                         board[row][col + 2].type === candyType;
    
    if (hasVertical && hasHorizontal) {
      // Update match type to cross for all involved candies
      addMatch(row, col, 'cross');
      addMatch(row + 1, col, 'cross');
      addMatch(row + 2, col, 'cross');
      addMatch(row, col + 1, 'cross');
      addMatch(row, col + 2, 'cross');
    }
  });

  return Array.from(matchedPositions).map(pos => {
    const [row, col] = pos.split(',').map(Number);
    return matches.find(m => m.row === row && m.col === col)!;
  });
}