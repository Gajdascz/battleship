const addInitializeAvailableMoves = (ai) => {
  ai.initializeAvailableMoves = function () {
    const trackingGrid = this.board.trackingGrid;
    this.availableMoves = [];
    trackingGrid.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        if (col === null) this.availableMoves.push([rowIndex, colIndex]);
      });
    });
  };
};

const addGetRandomMove = (ai) => {
  ai.getRandomMove = function () {
    if (this.availableMoves.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * this.availableMoves.length);
    return this.availableMoves[randomIndex];
  };
};

const addRemoveAvailableMove = (ai) => {
  ai.removeAvailableMove = function (coordinates) {
    const index = this.availableMoves.findIndex((move) => move[0] === coordinates[0] && move[1] === coordinates[1]);
    if (index !== -1) this.availableMoves.splice(index, 1);
  };
};

const addSendAttack = (ai) => {
  ai.sendAttack = function (move) {
    let validatedMove = move;
    if (!move) {
      if (this.availableMoves.length > 0) validatedMove = this.getRandomMove();
      return null;
    }
    this.removeAvailableMove(validatedMove);
    return this.sendOutgoingAttack(validatedMove);
  };
};

const addPlaceShips = (ai) => {
  ai.placeShips = function () {
    const maxVertical = this.board.mainGrid.length - 1;
    const maxHorizontal = this.board.mainGrid[0].length - 1;
    const orientationChoices = ['vertical', 'horizontal'];

    const getRandomOrientation = () => orientationChoices[Math.floor(Math.random() * orientationChoices.length)];
    const isPlacementValid = (coordinates) => coordinates.every((c) => this.board.mainGrid[c[0]][[c[1]]] === null);

    this.fleet.forEach((ship) => {
      let placed = false;
      let attempts = 0;
      while (!placed) {
        const startingCell = this.getRandomMove();
        const orientation = getRandomOrientation();
        const cells = [];
        const end =
          orientation === 'vertical'
            ? Math.min(startingCell[0] + ship.length - 1, maxVertical)
            : Math.min(startingCell[1] + ship.length - 1, maxHorizontal);
        const start = Math.max(end - ship.length + 1, 0);
        for (let i = start; i <= end; i++) {
          cells.push(orientation === 'vertical' ? [i, startingCell[1]] : [startingCell[0], i]);
        }
        if (isPlacementValid(cells)) {
          const firstPlacementCell = orientation === 'vertical' ? [start, startingCell[1]] : [startingCell[0], start];
          const lastPlacementCell = orientation === 'vertical' ? [end, startingCell[1]] : [startingCell[0], end];
          if (this.board.place({ ship, start: firstPlacementCell, end: lastPlacementCell })) placed = true;
        }
        attempts++;
        if (attempts > 250) throw new Error('AI could not find ship placement positions.');
      }
    });
  };
};

export default function initBaseAILogic(ai) {
  addInitializeAvailableMoves(ai);
  addRemoveAvailableMove(ai);
  addGetRandomMove(ai);
  addSendAttack(ai);
  addPlaceShips(ai);
  return ai;
}
