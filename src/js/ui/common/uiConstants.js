export const GAME = {
  CLASSES: {
    CONTAINER: 'game-container',
    PLAYER_DISPLAY: 'current-player-display',
    BOARD_CONTAINER: 'board-container'
  }
};

export const ELEMENT_TYPES = {
  BUTTON: 'button',
  DIV: 'div',
  PARAGRAPH: 'p',
  DIALOG: 'dialog',
  SPAN: 'span',
  H1: 'h1',
  H2: 'h2',
  H3: 'h3',
  H4: 'h4',
  H5: 'h5',
  H6: 'h6',
  OL: 'ol',
  UL: 'ul',
  LI: 'li'
};

export const GRID = {
  COORDINATES_DATA: (row, col) => ({ 'data-coordinates': `${row + col}` }),
  CELL_STATUS_DATA: (status = 'unexplored') => ({ 'data-cell-status': status }),
  CELL_CLASS: 'grid-cell',
  ROW_CLASS: 'board-row',
  TYPES: {
    MAIN: 'main-grid',
    TRACKING: 'tracking-grid'
  },
  LABELS: {
    ROW_CLASS: 'board-row-label',
    COL_CONTAINER_CLASS: 'board-col-labels',
    COL_CLASS: 'board-col-label',
    AXIS_CLASS: 'board-axis-label'
  },
  MAIN: {
    HEADER: 'Home Territory',
    HEADER_CLASS: 'main-grid-header',
    CELL_TYPE: ELEMENT_TYPES.DIV,
    WRAPPER_CLASS: 'main-grid-wrapper'
  },
  TRACKING: {
    HEADER: 'Enemy Territory',
    HEADER_CLASS: 'tracking-grid-header',
    VALUE: (row, col) => `${row + col}`,
    CELL_TYPE: ELEMENT_TYPES.BUTTON,
    WRAPPER_CLASS: 'tracking-grid-wrapper'
  }
};

export const FLEET_LIST = {
  MAIN: {
    CLASS: 'main-fleet-list',
    CONTAINER_CLASS: 'main-fleet-list-container',
    HEADER: 'Your Fleet',
    CONTAINER_HEADER_CLASS: 'main-fleet-list-container-header',
    BUTTONS_CONTAINER_CLASS: 'fleet-list-button-container'
  },
  TRACKING: {
    CLASS: 'tracking-fleet-list',
    CONTAINER_CLASS: 'tracking-fleet-list-container',
    HEADER: 'Enemy Fleet',
    CONTAINER_HEADER_CLASS: 'tracking-fleet-list-container-header'
  }
};

export const GAME_OVER_DIALOG = {
  CLASSES: {
    DIALOG: 'game-over-dialog',
    HEADER: 'game-over-dialog-header',
    WINNER_NAME: 'game-winner-name',
    WINNER_WINS: 'winner-wins-text',
    BUTTON_CONTAINER: 'game-over-button-container',
    PLAY_AGAIN_BUTTON: 'play-again-button',
    CLOSE_BUTTON: 'close-this-dialog-button'
  },
  TEXTS: {
    WINNER: ` Wins!`,
    PLAY_AGAIN_BUTTON: 'Play Again',
    CLOSE_BUTTON: 'Close This Dialog'
  },
  EVENTS: {
    RESTART: 'gameRestarted'
  }
};

export const SHIP = {
  CLASSES: {
    ENTRY: 'fleet-entry',
    SHIP_NAME: 'ship-name',
    BEING_PLACED: 'being-placed'
  },
  DATA: {
    NAME: (name) => ({ 'data-name': name }),
    SUNK: () => ({ 'data-sunk': false }),
    LENGTH: (length) => ({ 'data-length': `${length}` }),
    ORIENTATION: () => ({ 'data-orientation': 'vertical' }),
    PLACED: () => ({ 'data-placed': false })
  },
  EVENTS: {
    SELECTED: 'shipSelected',
    ORIENTATION_CHANGED: 'shipOrientationChanged'
  }
};
