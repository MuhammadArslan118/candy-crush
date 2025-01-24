import React, { useState, useEffect } from 'react';
import { Candy, Level } from '../types';
import { checkForMatches, createBoard } from '../utils/gameLogic';
import { levels } from '../utils/levels';
import useSound from '../hooks/useSound';

const BOARD_SIZE = 8;
const CANDY_TYPES = ['🍬', '🍭', '🍪', '🍫', '🍡', '🧁'];

export default function Board() {
  const [board, setBoard] = useState<Candy[][]>([]);
  const [score, setScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState<Level>(levels[0]);
  const [movesLeft, setMovesLeft] = useState(levels[0].moves);
  const [specialGoalCount, setSpecialGoalCount] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const { playMatch, playSwap, playInvalid } = useSound();

  const resetLevel = (level: Level) => {
    const newBoard = createBoard(BOARD_SIZE, CANDY_TYPES);
    setBoard(newBoard);
    setScore(0);
    setMovesLeft(level.moves);
    setSpecialGoalCount(0);
    setGameState('playing');
  };

  useEffect(() => {
    resetLevel(currentLevel);
  }, [currentLevel]);

  useEffect(() => {
    const checkBoard = async () => {
      const matches = checkForMatches(board);
      if (matches.length > 0) {
        playMatch();
        
        // Calculate score and special goals
        const newScore = matches.reduce((acc, match) => {
          const { row, col, matchType } = match;
          const candyType = board[row][col].type;
          
          // Update special goal count if needed
          if (currentLevel.specialGoal && candyType === currentLevel.specialGoal.type) {
            setSpecialGoalCount(prev => prev + 1);
          }
          
          switch (matchType) {
            case 'mega': return acc + 500;
            case 'line': return acc + 300;
            case 'cross': return acc + 400;
            default: return acc + 100;
          }
        }, 0);
        
        setScore(prev => prev + newScore);
        
        // Remove matched candies
        const newBoard = [...board];
        matches.forEach(({row, col, matchType}) => {
          newBoard[row][col] = {
            ...newBoard[row][col],
            type: '',
            isMatched: true,
            matchType
          };
        });
        setBoard(newBoard);

        // Animate falling candies
        await new Promise(resolve => setTimeout(resolve, 500));

        // Fill empty spaces
        for (let col = 0; col < BOARD_SIZE; col++) {
          let emptySpaces = 0;
          for (let row = BOARD_SIZE - 1; row >= 0; row--) {
            if (!newBoard[row][col].type) {
              emptySpaces++;
            } else if (emptySpaces > 0) {
              newBoard[row + emptySpaces][col] = newBoard[row][col];
              newBoard[row][col] = { type: '', isMatched: false };
            }
          }
          // Fill top with new candies
          for (let row = 0; row < emptySpaces; row++) {
            newBoard[row][col] = {
              type: CANDY_TYPES[Math.floor(Math.random() * CANDY_TYPES.length)],
              isMatched: false
            };
          }
        }
        setBoard([...newBoard]);
      }
    };

    checkBoard();
  }, [board, currentLevel]);

  useEffect(() => {
    // Check win/lose conditions
    if (gameState === 'playing') {
      const hasWon = score >= currentLevel.targetScore && 
        (!currentLevel.specialGoal || specialGoalCount >= currentLevel.specialGoal.count);
      
      if (hasWon) {
        setGameState('won');
      } else if (movesLeft === 0) {
        setGameState('lost');
      }
    }
  }, [score, movesLeft, specialGoalCount, currentLevel, gameState]);

  const handleDragStart = (e: React.DragEvent, row: number, col: number) => {
    if (gameState !== 'playing') return;
    
    e.dataTransfer.setData('text/plain', `${row},${col}`);
    const dragImage = new Image();
    dragImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    (e.target as HTMLElement).style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).style.opacity = '1';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetRow: number, targetCol: number) => {
    e.preventDefault();
    if (gameState !== 'playing') return;

    const [sourceRow, sourceCol] = e.dataTransfer.getData('text/plain').split(',').map(Number);
    
    const isAdjacent = (
      (Math.abs(sourceRow - targetRow) === 1 && sourceCol === targetCol) ||
      (Math.abs(sourceCol - targetCol) === 1 && sourceRow === targetRow)
    );

    if (isAdjacent) {
      const newBoard = [...board];
      const temp = newBoard[sourceRow][sourceCol];
      newBoard[sourceRow][sourceCol] = newBoard[targetRow][targetCol];
      newBoard[targetRow][targetCol] = temp;

      const hasMatches = checkForMatches(newBoard).length > 0;
      
      if (hasMatches) {
        playSwap();
        setBoard(newBoard);
        setMovesLeft(prev => prev - 1);
      } else {
        playInvalid();
        // Swap back
        newBoard[targetRow][targetCol] = newBoard[sourceRow][sourceCol];
        newBoard[sourceRow][sourceCol] = temp;
      }
    }
  };

  const handleNextLevel = () => {
    const nextLevelIndex = levels.findIndex(l => l.number === currentLevel.number) + 1;
    if (nextLevelIndex < levels.length) {
      setCurrentLevel(levels[nextLevelIndex]);
    }
  };

  const handleRetry = () => {
    resetLevel(currentLevel);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentLevel.background} flex flex-col items-center justify-center p-8`}>
      <h1 className="text-5xl font-bold text-white mb-8 text-center">
        Candy Crush React - Level {currentLevel.number}
      </h1>
      
      <div className="flex flex-col items-center gap-8">
        <div className="flex gap-8 text-2xl font-bold text-white">
          <div>Score: {score}/{currentLevel.targetScore}</div>
          <div>Moves: {movesLeft}</div>
          {currentLevel.specialGoal && (
            <div>
              {currentLevel.specialGoal.type}: {specialGoalCount}/{currentLevel.specialGoal.count}
            </div>
          )}
        </div>

        {gameState !== 'playing' && (
          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <h2 className="text-3xl font-bold mb-4">
              {gameState === 'won' ? '🎉 Level Complete!' : '😢 Game Over'}
            </h2>
            <div className="flex gap-4">
              {gameState === 'won' && currentLevel.number < levels.length && (
                <button
                  onClick={handleNextLevel}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Next Level
                </button>
              )}
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {gameState === 'won' ? 'Play Again' : 'Try Again'}
              </button>
            </div>
          </div>
        )}

        <div className="grid gap-1 p-4 bg-purple-100 rounded-lg shadow-xl">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1">
              {row.map((candy, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-16 h-16 flex items-center justify-center text-3xl 
                    bg-white rounded-lg shadow transition-all duration-300
                    ${candy.isMatched ? 
                      candy.matchType === 'mega' ? 'animate-ping scale-150 bg-yellow-200' :
                      candy.matchType === 'line' ? 'animate-bounce scale-125 bg-blue-200' :
                      candy.matchType === 'cross' ? 'animate-spin scale-125 bg-green-200' :
                      'animate-ping' : ''
                    }
                    ${gameState === 'playing' ? 'hover:bg-purple-50 cursor-move' : 'cursor-not-allowed'}`}
                  draggable={gameState === 'playing'}
                  onDragStart={(e) => handleDragStart(e, rowIndex, colIndex)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                >
                  {candy.type}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}