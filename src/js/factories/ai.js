import createPlayer from './player.js';

const addInitializeAvailableMoves = (ai) => {
  ai.initializeAvailableMoves = function initializeAvailableMoves() {
    const trackingGrid = this.board.trackingGrid;
    this.availableMoves = [];
    trackingGrid.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        if (col === null) this.availableMoves.push([rowIndex, colIndex]);
      });
    });
  };
};

const addRemoveAvailableMove = (ai) => {
  ai.removeAvailableMove = function removeAvailableMove(coordinates) {
    const index = this.availableMoves.findIndex((move) => move[0] === coordinates[0] && move[1] === coordinates[1]);
    if (index !== -1) this.availableMoves.splice(index, 1);
  };
};

const addFormatCoordinates = (ai) => {
  ai.formatCoordinates = function formatCoordinates(coordinates) {
    let [row, col] = coordinates;
    const getLetter = (index) => String.fromCharCode(65 + index);
    if (this.board.letterAxis === 'row') return [getLetter(row), col];
    else return [row, getLetter(col)];
  };
};

const addGetRandomMove = (ai) => {
  ai.getRandomMove = function getRandomMove() {
    if (this.availableMoves.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * this.availableMoves.length);
    return this.availableMoves[randomIndex];
  };
};

const addSendAttack = (ai) => {
  ai.sendAttack = function sendAttack(move) {
    let validatedMove = move;
    if (!move) {
      if (this.availableMoves.length > 0) validatedMove = this.getRandomMove();
      return null;
    }
    const finalMove = this.formatCoordinates(validatedMove);
    this.removeAvailableMove(validatedMove);
    return this.sendOutgoingAttack(finalMove);
  };
};

const addLastHitAndDirections = (ai) => {
  ai.lastHit = null;
  ai.directions = {
    up: [-1, 0],
    right: [0, 1],
    down: [1, 0],
    left: [0, -1]
  };
};

const addIsWithinGrid = (ai) => {
  ai.isWithinGrid = function isWithinGrid(position) {
    const bounds = [this.board.trackingGrid.length, this.board.trackingGrid[0].length];
    return position[0] >= 0 && position[0] < bounds[0] && position[1] >= 0 && position[1] < bounds[1];
  };
};

const addFindAround = (ai) => {
  ai.findAround = function findAround(position) {
    const movesAround = [];
    for (let [key, value] of Object.entries(this.directions)) {
      let dx = position[0] + value[0];
      let dy = position[1] + value[1];
      if (
        this.isWithinGrid([dx, dy]) &&
        (this.board.trackingGrid[dx][dy] === null || this.board.trackingGrid[dx][dy] === 1)
      ) {
        movesAround.push({ [key]: this.board.trackingGrid[dx][dy] });
      }
    }
    return movesAround;
  };
};

const addProcessMoveResult = (ai) => {
  ai.processMoveResult = function processMoveResult(move, result) {
    if (result === true) this.lastHit = move;
    else this.lastHit = null;
  };
};

const addMediumLogic = (ai) => {
  ai.makeMove = function makeMove() {
    if (!this.lastHit) {
      const move = this.getRandomMove();
      const result = this.sendAttack(move);
      this.processMoveResult(move, result);
      return result;
    } else {
      const movesAround = this.findAround(this.lastHit);
      let move;
      if (movesAround.length === 0 && this.availableMoves.length > 0) move = this.getRandomMove();
      else move = movesAround[Math.floor(Math.random() * movesAround.length)];
      const result = this.sendAttack(move);
      this.processMoveResult(move, result);
      return result;
    }
  };
};

const addAdvancedLogic = (ai) => {
  ai.maxDepth = 10;
  ai.reverseDirection = (direction) => direction.map((dir) => -dir);
  ai.followHit = function followHit(position, direction, depth = 0) {
    if (depth > this.maxDepth) return null;
    console.log(position);
    let nextPos = position.map((coord, index) => coord + direction[index]);

    if (!this.isWithinGrid(nextPos)) return this.followHit(position, this.reverseDirection(direction), depth + 1);
    let cell = this.board.trackingGrid[nextPos[0]][nextPos[1]];
    if (cell === null) return nextPos;
    else if (cell === 1) return this.followHit(nextPos, direction, depth + 1);
    else if (cell === 0) return this.followHit(nextPos, this.reverseDirection(direction), depth + 1);
  };
  ai.makeMove = function makeMove() {
    let bestMove = null;
    const potentialMoves = [];
    if (!this.lastHit) move = this.getRandomMove();
    else {
      const movesAround = this.findAround(this.lastHit);
      if (movesAround.length === 0) move = this.getRandomMove();
      else {
        for (let move of movesAround) {
          for (let [direction, value] of Object.entries(move)) {
            if (value === 1) {
              bestMove = this.followHit(this.lastHit, this.directions[direction]);
              break;
            } else if (value === null)
              potentialMoves.push([
                this.lastHit[0] + this.directions[direction][0],
                this.lastHit[1] + this.directions[direction][1]
              ]);
          }
        }
      }
    }
    const move = bestMove ?? potentialMoves[Math.floor(Math.random() * potentialMoves.length)];
    const result = this.sendAttack(move);
    this.processMoveResult(move, result);
    return result;
  };
};

const initBaseAI = (isEasy = true) => {
  const ai = createPlayer();
  ai.type = 'ai';
  Object.defineProperty(ai, 'isAI', {
    get: function () {
      return true;
    }
  });
  addInitializeAvailableMoves(ai);
  addRemoveAvailableMove(ai);
  addFormatCoordinates(ai);
  addGetRandomMove(ai);
  addSendAttack(ai);
  if (!isEasy) {
    addLastHitAndDirections(ai);
    addIsWithinGrid(ai);
    addFindAround(ai);
    addProcessMoveResult(ai);
  }
  return ai;
};

const initDifficultyZero = () => {
  const ai = initBaseAI();
  ai.name = 'Seaman Bumbling BitBarnacle';
  ai.makeMove = function makeMove() {
    return this.sendAttack(this.getRandomMove());
  };
  return ai;
};

const initDifficultyOne = () => {
  const ai = initBaseAI(false);
  ai.name = 'Captain CodeSmells';
  addMediumLogic(ai);
  return ai;
};

const initDifficultyTwo = () => {
  const ai = initBaseAI(false);
  ai.name = 'Fleet Admiral ByteBeard';
  addAdvancedLogic(ai);
  return ai;
};

export default function computerAI(difficulty = 1) {
  if (difficulty === 0) return initDifficultyZero();
  else if (difficulty === 1) return initDifficultyOne();
  else if (difficulty === 2) return initDifficultyTwo();
}
