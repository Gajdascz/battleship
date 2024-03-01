export const DEFAULT_FLEET = [
  { name: 'Carrier', length: 5 }
  // { name: 'Battleship', length: 4 },
  // { name: 'Destroyer', length: 3 },
  // { name: 'Submarine', length: 3 },
  // { name: 'Patrol Boat', length: 2 }
];

export const MAIN_FLEET = {
  TYPE: 'main-fleet',
  CLASSES: {
    SHIP_LIST: 'main-fleet-ship-list',
    HEADER: 'main-fleet-header',
    BUTTONS_CONTAINER: 'main-fleet-button-container'
  },
  PROPERTIES: {
    HEADER_TEXT: 'Your Fleet'
  }
};

export const TRACKING_FLEET = {
  TYPE: 'tracking-fleet',
  CLASSES: {
    SHIP_LIST: 'tracking-fleet-ship-list',
    HEADER: 'tracking-fleet-header'
  },
  PROPERTIES: {
    HEADER_TEXT: 'Enemy Fleet'
  }
};
