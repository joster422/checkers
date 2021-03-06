import { Component } from '@angular/core';
import { Cell, Form, Game } from '../models';
import { GameService } from '../game.service';
import { Move } from '../models/move';

@Component({
  selector: 'checkers-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {
  game!: Game;
  form = new Form();
  moves: Move[] = [];
  source?: Cell;
  targets: Cell[] = [];

  constructor(private gameService: GameService) {
    this.newGame();
  }

  isDisabled(cell: Cell) {
    const isSource = this.moves
      .map(move => move.source)
      .includes(cell) === true;

    const isNextTarget = this.moves
      .filter(move => move.source === this.source)
      .filter(move => this.targets.every((target, index) => move.targets.indexOf(target) === index))
      .map(move => move.targets[this.targets.length])
      .includes(cell) === true;

    return isSource === false && isNextTarget === false;
  }

  click(cell: Cell) {
    if (this.targets.length === 0 && cell.occupant?.side === this.game.turn) {
      this.source = cell === this.source
        ? undefined
        : cell;
      this.targets = [];
      return;
    }

    this.targets = [...this.targets, cell];

    const moves = this.moves
      .filter(move => move.source === this.source)
      .filter(move => this.targets.every((target, index) => move.targets.indexOf(target) === index));

    if (moves.length === 0)
      throw new Error('invalid move, cell should be disabled');

    if (moves.length === 1 && moves[0].targets.length === this.targets.length) {
      this.game.play(moves[0]);
      this.moves = this.game.moves();
      delete this.source;
      this.targets = [];
      return;
    }
  }

  newGame() {
    // const board = this.gameService.createBoard(this.form);
    const board = this.gameService.createTestBoard();
    this.game = new Game(board);
    this.moves = this.game.moves();
  }
}
