import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  // The minimalist TicTacToe board
  grid: ('X' | 'O' | '')[][] = [];
  currentPlayer: 'X' | 'O' = 'X';
  winner: '' | 'X' | 'O' = '';
  winningLine: Array<[number, number]> = [];
  draw: boolean = false;

  // PUBLIC_INTERFACE
  constructor() {
    this.resetGame();
  }

  // PUBLIC_INTERFACE
  get statusMessage(): string {
    if (this.winner) {
      return `Player ${this.winner} wins!`;
    }
    if (this.draw) {
      return "It's a draw!";
    }
    return `Player ${this.currentPlayer}'s turn`;
  }

  // PUBLIC_INTERFACE
  resetGame(): void {
    this.grid = Array(3).fill(null).map(() => Array(3).fill(''));
    this.currentPlayer = 'X';
    this.winner = '';
    this.winningLine = [];
    this.draw = false;
  }

  // PUBLIC_INTERFACE
  handleClick(i: number, j: number): void {
    // Only play if cell is empty and no winner yet
    if (!this.canPlay(i, j)) return;
    this.grid[i][j] = this.currentPlayer;
    if (this.checkWin()) {
      this.winner = this.currentPlayer;
      return;
    }
    if (this.grid.flat().every(cell => cell)) {
      this.draw = true;
      return;
    }
    // Switch player
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
  }

  // PUBLIC_INTERFACE
  canPlay(i: number, j: number): boolean {
    return !this.grid[i][j] && !this.winner && !this.draw;
  }

  // PUBLIC_INTERFACE
  isCellInWin(i: number, j: number): boolean {
    return this.winningLine.some(([x, y]) => x === i && y === j);
  }

  // PUBLIC_INTERFACE
  checkWin(): boolean {
    const lines: Array<[[number, number],[number, number],[number, number]]> = [
      // Rows
      [[0,0],[0,1],[0,2]],
      [[1,0],[1,1],[1,2]],
      [[2,0],[2,1],[2,2]],
      // Cols
      [[0,0],[1,0],[2,0]],
      [[0,1],[1,1],[2,1]],
      [[0,2],[1,2],[2,2]],
      // Diags
      [[0,0],[1,1],[2,2]],
      [[0,2],[1,1],[2,0]],
    ];
    for (const line of lines) {
      const [a, b, c] = line;
      const v = this.grid[a[0]][a[1]];
      if (v && v === this.grid[b[0]][b[1]] && v === this.grid[c[0]][c[1]]) {
        this.winningLine = [a, b, c];
        return true;
      }
    }
    this.winningLine = [];
    return false;
  }
}
