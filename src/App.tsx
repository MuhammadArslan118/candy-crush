import React from 'react';
import Board from './components/Board';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-500 flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold text-white mb-8 text-center">
        Candy Crush React
      </h1>
      <Board />
    </div>
  );
}

export default App;