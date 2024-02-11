export const DEFAULT_FLEET = [
  { shipName: 'Carrier', shipLength: 5 },
  { shipName: 'Battleship', shipLength: 4 },
  { shipName: 'Destroyer', shipLength: 3 },
  { shipName: 'Submarine', shipLength: 3 },
  { shipName: 'Patrol Boat', shipLength: 2 }
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
