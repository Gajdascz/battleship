export const GENERAL_EVENTS = {
  CHANGE: 'change'
};

export const MOUSE_EVENTS = {
  CLICK: 'click',
  DOUBLE_CLICK: 'dblclick',
  DOWN: 'mousedown',
  UP: 'mouseup',
  MOVE: 'mousemove',
  ENTER: 'mouseenter',
  LEAVE: 'mouseleave',
  OVER: 'mouseover',
  CONTEXT_MENU: 'contextmenu'
};
export const KEY_EVENTS = {
  DOWN: 'keydown',
  UP: 'keyup',
  CODES: {
    Q: 'KeyQ',
    W: 'KeyW',
    E: 'KeyE',
    R: 'KeyR',
    T: 'KeyT',
    Y: 'KeyY',
    SPACE: 'Space',
    ESC: 'Escape',
    ENTER: 'Enter',
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight',
    TAB: 'Tab',
    SHIFT: 'Shift',
    CONTROL: 'Control',
    ALT: 'Alt',
    DELETE: 'Delete'
  }
};
export const EMITTER = {
  FULFILLED_HANDLE: (event) => `${event}#FULFILLED`
};

export const GAME_EVENTS = {
  STATE_CHANGED: 'stateChanged',
  GAME_RESTARTED: 'gameRestarted',
  SETTINGS_SUBMITTED: 'settingsSubmitted',
  TURN_ENDED: 'turnEnded',
  PLAYER_SWITCHED: 'playerSwitched'
};
export const START_EVENTS = {
  ALL_PLAYERS_INITIALIZED: 'allPlayersInitialized'
};

export const PLACEMENT_EVENTS = {
  GRID_PLACEMENT_PROCESSED: 'gridPlacementProcessed', // Entity placed and accepted in grid
  GRID_PLACEMENTS_FINALIZATION_REQUESTED: 'gridPlacementsFinalizationRequested', // Player submitted their ship placements for processing
  GRID_PLACEMENTS_FINALIZED: 'gridPlacementsFinalized', // Placements have been processed and finalized
  SHIP_PLACEMENT_CONTAINER_CREATED: 'shipPlacementContainerCreated', // A container has been created for ships to be placed within
  SHIP_SELECTED: 'shipSelected', // Ship selection request was realized and processed
  SHIP_READY_FOR_PLACEMENT: 'shipReadyForPlacement', // Ship selection and placement settings are initialized and ready for placement.
  SHIP_DESELECTED: 'shipDeselected',
  SHIP_ORIENTATION_TOGGLED: 'shipOrientationToggled',
  SHIP_PLACEMENT_SET: 'shipPlacementSet', // Ship received and stored placement details
  SHIP_SELECTION_REQUESTED: 'shipSelectionRequested',
  SHIP_PLACEMENT_REQUESTED: 'shipPlacementRequested',
  FLEET_ALL_SHIPS_READY_FOR_PLACEMENT: 'allShipsReadyForPlacement', // All ships within a fleet are ready for placement.
  ALL_PLACEMENTS_FINALIZED: 'allPlacementsFinalized'
};

export const PROGRESS_EVENTS = {
  ATTACK_PROCESSED: 'attackProcessed', // Sent attack has been processed
  ATTACK_INITIATED: 'attackInitiated', // Attack sent between players
  SHIP_HIT: 'shipHit',
  SHIP_SUNK: 'shipSunk'
};
