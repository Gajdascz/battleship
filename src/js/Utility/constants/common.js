export const PLAYERS = {
  IDS: {
    P1: 'playerOne',
    P2: 'playerTwo'
  },
  TYPES: {
    HUMAN: 'human',
    AI: 'ai'
  },
  DEFAULT_NAME: 'Mutinous' // Mutinous: (of a solider or sailor) refusing to obey the orders of a person in authority.
};

export const DEFAULT_FLEET = [
  { name: 'Carrier', length: 5 },
  { name: 'Battleship', length: 4 },
  { name: 'Destroyer', length: 3 },
  { name: 'Submarine', length: 3 },
  { name: 'Patrol Boat', length: 2 }
];

export const STATES = {
  START: 'startState',
  PLACEMENT: 'placementState',
  PROGRESS: 'progressState',
  OVER: 'overState'
};

// Represents grid cell status and attack outcomes.
export const STATUSES = {
  MISS: 'miss',
  HIT: 'hit',
  SHIP_SUNK: 'ship_sunk',
  ALL_SHIPS_SUNK: 'all_ships_sunk',
  UNEXPLORED: 'unexplored',
  OCCUPIED: 'occupied',
  EMPTY: 'empty'
};

// Grid traversal in vertical and horizontal orientations.
export const DIRECTIONS = {
  UP: [-1, 0],
  RIGHT: [0, 1],
  DOWN: [1, 0],
  LEFT: [0, -1]
};

// Valid ship orientations
export const ORIENTATIONS = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal'
};

// Defines which grid axis is labeled with letters.
// Common for use with coordinate conversions, grid configuration, etc.
export const LETTER_AXES = {
  COL: 'col',
  ROW: 'row'
};

export const GAME_MODES = {
  HvH: 'HvH', // human vs human
  HvA: 'HvA', // human vs ai
  AvA: 'AvA' // ai vs ai
};

export const AI_NAMES = [
  'Seaman Bumbling BitBarnacle',
  'Captain CodeSmells',
  'Fleet Admiral ByteBeard'
];
