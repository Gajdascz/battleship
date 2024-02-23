// Ordered by difficulty level
export const AI_NAMES = [
  'Seaman Bumbling BitBarnacle',
  'Captain CodeSmells',
  'Fleet Admiral ByteBeard'
];

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
