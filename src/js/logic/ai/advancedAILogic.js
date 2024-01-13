import queue from './hitQueue.js';

const addResetForNextMove = (ai) => {
  ai.resetForNextMove = function () {
    this.currentHitChain.length = 0;
    this.lastHit = null;
    this.clearVisited('hits');
    this.visitedDirection = null;
  };
};

const addAdvancedProcessMoveResult = (ai) => {
  const HIT = true;
  const SUNK = 2;
  ai.advancedProcessMoveResult = function (move, result) {
    if (result === HIT) {
      this.lastHit = move;
      this.currentHitChain.push(move);
    } else if (result === SUNK) {
      this.currentHitChain.push(move);
      if (this.currentHitChain.length !== this.fleetList.get(this.lastOpponentShipSunk)) {
        this.handleAlignedShipChain(this.currentHitChain[0], this.currentHitChain[this.currentHitChain.length - 1]);
      } else this.resetForNextMove();
    }
  };
};

const addHandleAlignedShipChain = (ai) => {
  ai.handleAlignedShipChain = function (startOfHitChain, endOfHitChain) {
    const findChainDirection = () => {
      const isVertical = this.currentHitChain.every((cell, index, array) => index === 0 || cell[1] === array[0][1]);
      if (isVertical) return this.currentHitChain[0][0] > this.currentHitChain[1][0] ? 'up' : 'down';
      else return this.currentHitChain[1][1] > this.currentHitChain[0][1] ? 'right' : 'left';
    };
    const findNextPosition = (cell, direction) => {
      const dx = cell[0] + direction[0];
      const dy = cell[1] + direction[1];
      if (this.isWithinGrid([dx, dy]) && this.board.trackingGrid[dx][dy] === null) return [dx, dy];
      return null;
    };
    const afterStart = findNextPosition(startOfHitChain, this.directions[findChainDirection()]);
    const afterEnd = findNextPosition(endOfHitChain, this.directions[findChainDirection()]);
    if (afterStart) this.unresolvedHits.enqueue(afterStart);
    if (afterEnd) this.unresolvedHits.enqueue(afterEnd);
    this.resetForNextMove();
  };
};

const addFollowHit = (ai) => {
  ai.currentHitChain = [];
  ai.unresolvedHits = queue();
  const reverseDirection = (direction) => direction.map((dir) => -dir);
  const getNextPosition = (currentPos, direction) => currentPos.map((coord, index) => coord + direction[index]);
  ai.followHit = function (position, direction) {
    let reverseCalls = 0;
    let currentPos = position.slice();
    const MISS = 0;
    const UNEXPLORED = null;
    while (reverseCalls < 2) {
      this.visitedDirection = direction;
      console.log(currentPos, direction);
      const nextPos = getNextPosition(currentPos, direction);
      const cellValue = this.board.trackingGrid[nextPos[0]][nextPos[1]];
      if (!this.isWithinGrid(nextPos) || cellValue === MISS) {
        direction = reverseDirection(direction);
        reverseCalls++;
        continue;
      }
      if (cellValue === UNEXPLORED) return { result: nextPos };
      else currentPos = nextPos;
    }
    this.currentHitChain.forEach((hit) => this.unresolvedHits.enqueue(hit));
    this.currentHitChain.length = 0;
    return { result: ['unresolved'] };
  };
};

const addDirectionProcessing = (ai) => {
  ai.visitedDirection = null;
  ai.hasFollowedThisDirection = function (direction) {
    return (
      this.visitedDirection &&
      Math.abs(direction[0]) === Math.abs(this.visitedDirection[1]) &&
      Math.abs(direction[1]) === Math.abs(this.visitedDirection[1])
    );
  };
};

const addCellTrackingProcessing = (ai) => {
  ai.cellTracking = new Map();
  ai.getTrackingKey = (cell) => cell.join(',');
  ai.getSet = (trackingType) => ai.cellTracking.get(trackingType);
  ai.addCellTracking = function (trackingType) {
    this.cellTracking.set(trackingType, new Set());
  };
  ai.hasVisited = function (trackingType, cell) {
    const set = this.getSet(trackingType);
    return set ? set.has(this.getTrackingKey(cell)) : false;
  };
  ai.addVisited = function (trackingType, cell) {
    const set = this.getSet(trackingType);
    if (set) set.add(this.getTrackingKey(cell));
  };
  ai.clearVisited = function (trackingType) {
    const set = this.getSet(trackingType);
    if (set) set.clear();
  };
};

const addSendAdvancedAttack = (ai) => {
  ai.sendAdvancedAttack = function (move) {
    const result = this.sendAttack(move);
    this.advancedProcessMoveResult(move, result);
    return { result, move };
  };
};

const addOpponentFleetTracker = (ai) => {
  ai.initializeOpponentFleetTracker = function () {
    this.fleetList = new Map(this.fleet.map((ship) => [ship.id, ship.length]));
  };
};

const addGetHitsToFollow = (ai) => {
  ai.getHitsToFollow = function () {
    const hitsAround = this.getHitsAround(this.lastHit);
    const hitsToFollow = hitsAround.filter((cell) => !this.hasVisited('hits', cell));
    return hitsToFollow.length > 0 ? hitsToFollow : null;
  };
};
const addFindBestMove = (ai) => {
  ai.findBestMove = function () {
    const hitsToFollow = this.getHitsToFollow();
    if (hitsToFollow) {
      this.addVisited('hits', hitsToFollow[0]);
      const followResult = this.followHit(hitsToFollow[0]);
      if (followResult.result[0] === 'unresolved') return this.makeMove();
      return followResult.result;
    } else {
      const openMovesAround = this.getOpenMovesAround(this.lastHit);
      if (openMovesAround.length > 0) return openMovesAround[Math.floor(Math.random() * openMovesAround.length)];
    }
  };
};

const addAdvancedMakeMove = (ai) => {
  ai.makeMove = function makeMove() {
    if (!this.lastHit && this.unresolvedHits.isEmpty) return this.sendAdvancedAttack(this.getRandomMove());
    if (!this.unresolvedHits.isEmpty && this.currentHitChain.length === 0) this.lastHit = this.unresolvedHits.dequeue();
    const bestMove = this.findBestMove(this.lastHit);
    return this.sendAdvancedAttack(bestMove);
  };
};

export default function addAdvancedLogic(ai) {
  addFollowHit(ai);
  addOpponentFleetTracker(ai);
  addDirectionProcessing(ai);
  addSendAdvancedAttack(ai);
  addHandleAlignedShipChain(ai);
  addCellTrackingProcessing(ai);
  addAdvancedProcessMoveResult(ai);
  addAdvancedMakeMove(ai);
  addResetForNextMove(ai);
  addFindBestMove(ai);
  addGetHitsToFollow(ai);
  ai.addCellTracking('hits');
}

//  addProcessMovesAround(ai);

//addMoveEvaluationProcessing(ai);

//addProcessFollowHit(ai);

// const addProcessFollowHit = (ai) => {
//   ai.processFollowHit = function (potentialHit, direction) {
//     const followResult = this.followHit(potentialHit, this.directions[direction]);
//     if (followResult.result[0] === 'unresolved') {
//       this.visitedDirection = direction;
//       return this.makeMove();
//     }
//     return followResult.result;
//   };
// };
// const addProcessMovesAround = (ai) => {
//   ai.processMovesAround = function (movesAround) {
//     const processMoveOption = (move) => {
//       for (const [direction, value] of Object.entries(move)) {
//         if (!this.hasFollowedThisDirection(direction)) return this.evaluateMove(direction, value);
//       }
//       return null;
//     };
//     if (movesAround.length === 0) return null;
//     for (const move of movesAround) {
//       const chosenMove = processMoveOption(move);
//       if (chosenMove) return chosenMove;
//     }
//     return null;
//   };
// };
// const addMoveEvaluationProcessing = (ai) => {
//   ai.evaluateMove = function (direction, cellValue) {
//     const potentialHit = [
//       this.lastHit[0] + this.directions[direction][0],
//       this.lastHit[1] + this.directions[direction][1]
//     ];
//     if (cellValue === 1 && !this.hasVisited('hits', potentialHit)) {
//       this.addVisited('hits', potentialHit);
//       return this.processFollowHit(potentialHit, direction);
//     } else if (cellValue === null) return potentialHit;
//   };
//   return null;
// // };
//   ai.followHit = function (position, direction, reverseCalls = 0) {
//     if (reverseCalls === 2) {
//       this.currentHitChain.forEach((hit) => {
//         console.log(this.currentHitChain);
//         this.unresolvedHits.enqueue(hit);
//         console.log(this.unresolvedHits.peek);
//       });
//       this.currentHitChain.length = 0;
//       return { result: ['unresolved'] };
//     }
//     const nextPos = position.map((coord, index) => coord + direction[index]);
//     if (!this.isWithinGrid(nextPos)) {
//       reverseCalls++;
//       return this.followHit(position, this.reverseDirection(direction), reverseCalls);
//     }
//     const cell = this.board.trackingGrid[nextPos[0]][nextPos[1]];
//     if (cell === null) return { result: nextPos };
//     else if (cell === 1) {
//       return this.followHit(nextPos, direction, reverseCalls);
//     } else if (cell === 0) {
//       reverseCalls++;
//       return this.followHit(nextPos, this.reverseDirection(direction), reverseCalls);
//     }
//   };
