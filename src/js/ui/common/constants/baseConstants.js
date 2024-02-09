import {
  ORIENTATIONS,
  PLAYERS,
  STATES,
  LETTER_AXES,
  RESULTS,
  EVENTS
} from '../../../utility/constants';

const ELEMENT_TYPES = {
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

const GAME = {
  CLASSES: {
    CONTAINER: 'game-container',
    PLAYER_DISPLAY: 'current-player-display',
    BOARD_CONTAINER: 'board-container'
  }
};
const ELEMENT_ATTRIBUTES = {
  DATA: (type) => `data-${type}`,
  VALUE: 'value',
  DISABLED: 'disabled'
};
const GRID = {
  COMMON: {
    CLASSES: {
      CELL: 'grid-cell',
      ROW: 'board-row',
      LABELS: {
        ROW: 'board-row-label',
        COL_CONTAINER: 'board-col-labels',
        COL: 'board-col-label'
      },
      GRID_TYPES: {
        MAIN: 'main-grid',
        TRACKING: 'tracking-grid'
      }
    }
  },
  MAIN: {
    ELEMENTS: {
      CELL: ELEMENT_TYPES.DIV
    },
    CLASSES: {
      HEADER: 'main-grid-header',
      WRAPPER: 'main-grid-wrapper',
      HIT_MARKER: 'main-grid-hit-marker'
    },
    ATTRIBUTES: {
      COORDINATES: ELEMENT_ATTRIBUTES.DATA('coordinates')
    },
    TEXTS: {
      MAIN: {
        HEADER: 'Home Territory'
      }
    }
  },
  TRACKING: {
    ELEMENTS: {
      CELL: ELEMENT_TYPES.BUTTON
    },
    CLASSES: {
      HEADER: 'tracking-grid-header',
      WRAPPER: 'tracking-grid-wrapper'
    },
    ATTRIBUTES: {
      CELL_STATUS: ELEMENT_ATTRIBUTES.DATA('cell-status'),
      VALUE: ELEMENT_ATTRIBUTES.VALUE
    },
    TEXTS: {
      HEADER: 'Enemy Territory'
    },
    STATUS_VALUES: {
      UNEXPLORED: 'unexplored',
      HIT: 'hit',
      MISS: 'miss'
    }
  }
};
const GRID_SELECTORS = {
  COMMON: {
    CELL: () => `.${GRID.COMMON.CLASSES.CELL}`
  },
  MAIN: {
    CELL: {
      COORDINATES: (coordinates) =>
        `${GRID.MAIN.ELEMENTS.CELL}[${GRID.MAIN.ATTRIBUTES.COORDINATES}='${coordinates}']`
    }
  },
  TRACKING: {
    CELL: {
      VALUE: (coordinates) =>
        `${GRID.TRACKING.ELEMENTS.CELL}[${GRID.TRACKING.ATTRIBUTES.VALUE}='${coordinates}']`
    }
  }
};
const FLEET_LIST = {
  COMMON: {
    CLASSES: {
      FLEET_LIST_TYPES: {
        MAIN: 'main-fleet-list',
        TRACKING: 'tracking-fleet-list'
      }
    }
  },
  MAIN: {
    CLASSES: {
      CONTAINER: 'main-fleet-list-container',
      HEADER_CONTAINER: 'main-fleet-list-container-header',
      BUTTONS_CONTAINER: 'fleet-list-button-container'
    },
    TEXTS: {
      HEADER: 'Your Fleet'
    }
  },
  TRACKING: {
    CLASSES: {
      CONTAINER: 'tracking-fleet-list-container',
      HEADER_CONTAINER: 'tracking-fleet-list-container-header'
    },
    TEXTS: {
      HEADER: 'Enemy Fleet'
    }
  }
};
const BOARD = {
  COMMON: {
    RESULTS,
    LETTER_AXES,
    CELL_STATUS: GRID.TRACKING.STATUS_VALUES
  },
  CLASSES: {
    GRIDS: {
      MAIN: GRID.COMMON.CLASSES.GRID_TYPES.MAIN,
      TRACKING: GRID.COMMON.CLASSES.GRID_TYPES.TRACKING,
      AI_DISPLAY: 'ai-display-tracking-grid',
      MAIN_GRID_HIT: GRID.MAIN.CLASSES.HIT_MARKER,
      TRACKING_WRAPPER: GRID.TRACKING.CLASSES.WRAPPER,
      CELL: GRID.COMMON.CLASSES.CELL
    },
    FLEETS: {
      MAIN_LIST: FLEET_LIST.COMMON.CLASSES.FLEET_LIST_TYPES.MAIN,
      TRACKING_LIST: FLEET_LIST.COMMON.CLASSES.FLEET_LIST_TYPES.TRACKING
    },
    PLAYER_IDS: {
      P1: PLAYERS.IDS.P1,
      P2: PLAYERS.IDS.P2
    }
  },
  ATTRIBUTES: {
    ASSIGNED_PLAYER_ID: ELEMENT_ATTRIBUTES.DATA('player')
  },
  EVENTS: {
    PLAYER_ATTACKED: 'playerAttacked'
  },
  SELECTORS: {
    GRIDS: GRID_SELECTORS
  }
};
const GAME_OVER_DIALOG = {
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

const FLEET_MANAGER = {
  EVENTS: {
    PLACEMENTS_SUBMITTED: 'placementsSubmitted'
  }
};

export {
  ELEMENT_TYPES,
  ELEMENT_ATTRIBUTES,
  FLEET_LIST,
  GAME,
  GRID,
  GRID_SELECTORS,
  BOARD,
  GAME_OVER_DIALOG,
  FLEET_MANAGER,
  ORIENTATIONS,
  PLAYERS,
  STATES,
  LETTER_AXES,
  RESULTS,
  EVENTS
};
