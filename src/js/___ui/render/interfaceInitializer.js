import { ELEMENT_TYPES, FLEET_LIST, GAME } from '../common/constants/baseConstants';
import { buildUIElement } from '../common/utility/uiBuilders';

import { ShipController } from '../components/Ship/ShipController';
import { FleetController } from '../components/Fleet/FleetController';

export default function InterfaceInitializer(elementManager) {
  const buildGameContainer = (classAttr = GAME.CLASSES.CONTAINER) =>
    buildUIElement(ELEMENT_TYPES.DIV, { attributes: { class: classAttr } });

  const buildCurrentPlayerDisplay = (classAttr = GAME.CLASSES.PLAYER_DISPLAY) =>
    buildUIElement(ELEMENT_TYPES.H2, { attributes: { class: classAttr } });

  const buildBoardContainer = (classAttr = GAME.CLASSES.BOARD_CONTAINER) =>
    buildUIElement(ELEMENT_TYPES.DIV, { attributes: { class: classAttr } });

  const initializeFleetManager = (playerFleet) => {
    const fleetManager = FleetManager();
    playerFleet.forEach((ship) => {
      const controller = ShipController(ship.length, ship.name, ELEMENT_TYPES.BUTTON);
      fleetManager.addShip(controller);
    });
    playerFleet.forEach((ship) => {
      const controller = ShipController(ship.length, ship.name, ELEMENT_TYPES.DIV);
      fleetManager.addTrackingShip(controller);
    });
    return fleetManager;
  };

  const initializeBoardController = (boardOptions, playerID) => {
    const boardController = BoardController(boardOptions);
    boardController.assignID(playerID);
    return boardController;
  };

  const buildGameBoardElement = (boardOptions, playerID, playerFleet) => {
    const fleetManager = initializeFleetManager(playerFleet);
    const boardController = initializeBoardController(boardOptions, playerID);
    boardController.populateFleetLists(
      fleetManager.getAllShipElements(),
      fleetManager.getAllTrackingShipElements()
    );
    return boardController.element;
  };

  const initializeBaseInterface = () => {
    const MAIN = document.querySelector('main');
    const gameContainer = buildGameContainer(GAME.CLASSES.CONTAINER);
    const currentPlayerDisplay = buildCurrentPlayerDisplay(GAME.CLASSES.PLAYER_DISPLAY);
    const boardContainer = buildBoardContainer(GAME.CLASSES.BOARD_CONTAINER);
    elementManager.cacheElement('boardContainer', boardContainer);
    elementManager.cacheElement('currentPlayerDisplay', currentPlayerDisplay);
    MAIN.append(gameContainer);
    gameContainer.append(currentPlayerDisplay, boardContainer);
  };

  return {
    buildGameContainer,
    buildCurrentPlayerDisplay,
    buildBoardContainer,
    buildGameBoardElement,

    initializeFleetManager,
    initializeBoardController,

    initializeBaseInterface,
    reset: () => (document.querySelector('main').textContent = '')
  };
}
