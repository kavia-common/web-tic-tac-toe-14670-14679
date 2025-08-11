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
    const value = board[index];
    const currentSymbol = isXNext ? 'X' : 'O';
    
    return (
      <button
        className={`square ${value ? 'filled' : ''} ${value ? (value === 'X' ? 'x-symbol' : 'o-symbol') : ''}`}
        onClick={() => handleClick(index)}
        aria-label={`Square ${index + 1}, ${value || 'empty'}${!value && gameStatus === 'playing' ? `, click to place ${currentSymbol}` : ''}`}
        data-preview={!value && gameStatus === 'playing' ? currentSymbol : ''}
        disabled={gameStatus !== 'playing'}
      >
        {value}
      </button>
    );
  }, [board, handleClick, isXNext, gameStatus]);

  const getStatusMessage = () => {
    if (gameStatus === 'won') {
      return (
        <>
          <span role="img" aria-label="celebration">🎉</span>
          Player {winner} Wins!
        </>
      );
    } else if (gameStatus === 'draw') {
      return (
        <>
          <span role="img" aria-label="handshake">🤝</span>
          It's a Draw!
        </>
      );
    } else {
      return (
        <>
          <span role="img" aria-label="game controller">🎮</span>
          Current Player: {isXNext ? 'X' : 'O'}
        </>
      );
    }
  };

  return (
    <div className="App">
      <main className="game-container" role="main" aria-labelledby="game-title">
        <header>
          <h1 id="game-title" className="game-title">Tic Tac Toe</h1>
        </header>
        
        <section className="status-section" aria-live="polite" aria-atomic="true">
          <div className={`status-message ${gameStatus}`} role="status">
            {getStatusMessage()}
          </div>
          {gameStatus !== 'playing' && (
            <div className="celebration" aria-live="polite">
              <span role="img" aria-label={gameStatus === 'won' ? 'confetti' : 'dice'}>
                {gameStatus === 'won' ? '🎊' : '🎲'}
              </span>
            </div>
          )}
        </section>

        <section className="board" role="grid" aria-label="Tic Tac Toe game board">
          <div className="board-row" role="row">
            {renderSquare(0)}
            {renderSquare(1)}
            {renderSquare(2)}
          </div>
          <div className="board-row" role="row">
            {renderSquare(3)}
            {renderSquare(4)}
            {renderSquare(5)}
          </div>
          <div className="board-row" role="row">
            {renderSquare(6)}
            {renderSquare(7)}
            {renderSquare(8)}
          </div>
        </section>

        <section className="actions">
          <button 
            className="reset-button"
            onClick={resetGame}
            aria-label="Reset game and start over"
          >
            <span role="img" aria-label="video game">🎮</span>
            New Game
          </button>
        </section>

        <footer className="game-info" role="contentinfo">
          <div className="player-info" role="group" aria-label="Player information">
            <div className={`player ${isXNext && gameStatus === 'playing' ? 'active' : ''}`} role="status">
              <span className="player-symbol" aria-hidden="true">X</span>
              <span className="player-label">Player 1</span>
            </div>
            <div className="vs" aria-hidden="true">vs</div>
            <div className={`player ${!isXNext && gameStatus === 'playing' ? 'active' : ''}`} role="status">
              <span className="player-symbol" aria-hidden="true">O</span>
              <span className="player-label">Player 2</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
