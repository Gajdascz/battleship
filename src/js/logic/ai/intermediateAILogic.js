const addLastHitAndDirections = (ai) => {
  ai.lastHit = null;
  ai.directions = {
    up: [-1, 0],
    right: [0, 1],
    down: [1, 0],
    left: [0, -1]
  };
  ai.getCellInADirection = function (direction, cell) {
    const dx = cell[0] + this.directions[direction][0];
    const dy = cell[1] + this.directions[direction][1];
    if (this.isWithinGrid([dx, dy])) return [dx, dy];
  };
  ai.getCellsInAllDirections = function (cell) {
    const cellsAround = [];
    for (const direction of Object.keys(this.directions)) {
      const cellInDirection = this.getCellInADirection(direction, cell);
      if (cellInDirection) cellsAround.push(cellInDirection);
    }
    return cellsAround;
  };
  ai.getHitsAround = function (cell) {
    return this.getCellsInAllDirections(cell).filter((cell) => this.board.trackingGrid[cell[0]][cell[1]] === 1);
  };
  ai.getOpenMovesAround = function (cell) {
    return this.getCellsInAllDirections(cell).filter((cell) => this.board.trackingGrid[cell[0]][cell[1]] === null);
  };
  ai.getCellDirection = function (original, proceeding) {
    const dx = original[0] - proceeding[0];
    const dy = original[1] - proceeding[1];
    if (dx === -1) return 'up';
    if (dy === -1) return 'left';
    if (dx === 1) return 'down';
    if (dy === 1) return 'right';
  };
};

const addIsWithinGrid = (ai) => {
  ai.isWithinGrid = function isWithinGrid(position) {
    const bounds = [this.board.trackingGrid.length, this.board.trackingGrid[0].length];
    return position[0] >= 0 && position[0] < bounds[0] && position[1] >= 0 && position[1] < bounds[1];
  };
};

const addProcessMoveResult = (ai) => {
  ai.processMoveResult = function (move, result) {
    if (result === 2) this.lastHit = null;
    else if (result === true) this.lastHit = move;
  };
};

const addIntermediateMakeMove = (ai) => {
  ai.makeMove = function makeMove() {
    if (!this.lastHit) {
      const move = this.getRandomMove();
      const result = this.sendAttack(move);
      this.processMoveResult(move, result);
      return { result, move };
    } else {
      const movesAround = this.getOpenMovesAround(this.lastHit);
      let move;
      if (movesAround.length === 0 && this.availableMoves.length > 0) move = this.getRandomMove();
      else move = movesAround[Math.floor(Math.random() * movesAround.length)];
      const result = this.sendAttack(move);
      this.processMoveResult(move, result);
      return { result, move };
    }
  };
};

export default function addIntermediateLogic(ai) {
  addLastHitAndDirections(ai);
  addIsWithinGrid(ai);
  addProcessMoveResult(ai);
  if (ai.difficulty === 1) addIntermediateMakeMove(ai);
}
