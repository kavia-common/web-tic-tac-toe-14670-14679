import React, { useState, useCallback } from 'react';
import './App.css';

// PUBLIC_INTERFACE
function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'draw'
  const [winner, setWinner] = useState(null);

  // PUBLIC_INTERFACE
  const calculateWinner = useCallback((squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }, []);

  // PUBLIC_INTERFACE
  const handleClick = useCallback((index) => {
    if (board[index] || gameStatus !== 'playing') {
      return;
    }

    const newBoard = board.slice();
    newBoard[index] = isXNext ? 'X' : 'O';
    
    const gameWinner = calculateWinner(newBoard);
    
    if (gameWinner) {
      setWinner(gameWinner);
      setGameStatus('won');
    } else if (newBoard.every(square => square !== null)) {
      setGameStatus('draw');
    }
    
    setBoard(newBoard);
    setIsXNext(!isXNext);
  }, [board, isXNext, gameStatus, calculateWinner]);

  // PUBLIC_INTERFACE
  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameStatus('playing');
    setWinner(null);
  }, []);

  // PUBLIC_INTERFACE
  const renderSquare = useCallback((index) => {
    return (
      <button
        className={`square ${board[index] ? 'filled' : ''}`}
        onClick={() => handleClick(index)}
        aria-label={`Square ${index + 1}, ${board[index] || 'empty'}`}
      >
        {board[index]}
      </button>
    );
  }, [board, handleClick]);

  const getStatusMessage = () => {
    if (gameStatus === 'won') {
      return `🎉 Player ${winner} Wins!`;
    } else if (gameStatus === 'draw') {
      return "🤝 It's a Draw!";
    } else {
      return `Current Player: ${isXNext ? 'X' : 'O'}`;
    }
  };

  return (
    <div className="App">
      <div className="game-container">
        <h1 className="game-title">Tic Tac Toe</h1>
        
        <div className="status-section">
          <div className={`status-message ${gameStatus}`}>
            {getStatusMessage()}
          </div>
          {gameStatus !== 'playing' && (
            <div className="celebration">
              {gameStatus === 'won' ? '🎊' : '🎲'}
            </div>
          )}
        </div>

        <div className="board">
          <div className="board-row">
            {renderSquare(0)}
            {renderSquare(1)}
            {renderSquare(2)}
          </div>
          <div className="board-row">
            {renderSquare(3)}
            {renderSquare(4)}
            {renderSquare(5)}
          </div>
          <div className="board-row">
            {renderSquare(6)}
            {renderSquare(7)}
            {renderSquare(8)}
          </div>
        </div>

        <div className="actions">
          <button 
            className="reset-button"
            onClick={resetGame}
            aria-label="Reset game and start over"
          >
            🎮 New Game
          </button>
        </div>

        <div className="game-info">
          <div className="player-info">
            <div className={`player ${isXNext && gameStatus === 'playing' ? 'active' : ''}`}>
              <span className="player-symbol">X</span>
              <span className="player-label">Player 1</span>
            </div>
            <div className="vs">vs</div>
            <div className={`player ${!isXNext && gameStatus === 'playing' ? 'active' : ''}`}>
              <span className="player-symbol">O</span>
              <span className="player-label">Player 2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
