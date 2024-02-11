import { STATES } from './common';

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
};

export const GENERAL_EVENTS = {
  GAME_STARTED: STATES.START,
  GAME_ENDED: STATES.OVER,
  STATE_TRANSITIONED: 'stateTransitioned',
  RESTARTED: 'gameRestarted',
  SETTINGS_SUBMITTED: 'settingsSubmitted',
  TURN_CONCLUDED: 'turnConcluded',
  PLAYER_SWITCHED: 'playerSwitched'
};

export const PLACEMENT_EVENTS = {
  STATE: STATES.PLACEMENT,
  SUBMITTED: 'placementsSubmitted',
  PROCESSED: 'placementsProcessed',
  SHIP: {
    SELECTED: 'shipSelected',
    ORIENTATION_CHANGED: 'shipOrientationChanged',
    PLACED: 'shipPlaced',
    PLACED_SUCCESS: 'shipPlacementSuccessful'
  }
};

export const PROGRESS_EVENTS = {
  STATE: STATES.PROGRESS,

  ATTACK: {
    PROCESSED: 'attackProcessed',
    INITIATED: 'playerAttacked',
    SHIP_HIT: 'shipHit',
    SHIP_SUNK: 'shipSunk'
  }
};
