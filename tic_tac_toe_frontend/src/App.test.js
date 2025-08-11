import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders tic tac toe game title', () => {
  render(<App />);
  const titleElement = screen.getByText(/tic tac toe/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders game board with 9 squares', () => {
  render(<App />);
  const squares = screen.getAllByRole('button', { name: /square \d+/ });
  expect(squares).toHaveLength(9);
});

test('displays current player initially as X', () => {
  render(<App />);
  const statusElement = screen.getByText(/current player: x/i);
  expect(statusElement).toBeInTheDocument();
});

test('allows player to make a move', () => {
  render(<App />);
  const firstSquare = screen.getByRole('button', { name: /square 1/ });
  fireEvent.click(firstSquare);
  expect(firstSquare).toHaveTextContent('X');
});

test('switches players after a move', () => {
  render(<App />);
  const firstSquare = screen.getByRole('button', { name: /square 1/ });
  fireEvent.click(firstSquare);
  const statusElement = screen.getByText(/current player: o/i);
  expect(statusElement).toBeInTheDocument();
});

test('prevents clicking on already filled squares', () => {
  render(<App />);
  const firstSquare = screen.getByRole('button', { name: /square 1/ });
  fireEvent.click(firstSquare);
  expect(firstSquare).toHaveTextContent('X');
  
  // Try to click the same square again
  fireEvent.click(firstSquare);
  expect(firstSquare).toHaveTextContent('X'); // Should still be X, not O
});

test('renders reset button', () => {
  render(<App />);
  const resetButton = screen.getByRole('button', { name: /new game/i });
  expect(resetButton).toBeInTheDocument();
});

test('resets game when reset button is clicked', () => {
  render(<App />);
  const firstSquare = screen.getByRole('button', { name: /square 1/ });
  const resetButton = screen.getByRole('button', { name: /new game/i });
  
  // Make a move
  fireEvent.click(firstSquare);
  expect(firstSquare).toHaveTextContent('X');
  
  // Reset the game
  fireEvent.click(resetButton);
  expect(firstSquare).toHaveTextContent('');
  
  // Check that it's X's turn again
  const statusElement = screen.getByText(/current player: x/i);
  expect(statusElement).toBeInTheDocument();
});
