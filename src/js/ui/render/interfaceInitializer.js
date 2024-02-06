import { buildGameBoard } from '../gameBoard/buildGameBoard';
import { buildShip } from '../ship/_buildShip';
import { ELEMENT_TYPES, FLEET_LIST, GAME } from '../common/uiConstants';
import { buildUIElement } from '../common/uiUtility';

export default function InterfaceInitializer(elementManager) {
  const buildGameContainer = (classAttr = GAME.CLASSES.CONTAINER) =>
    buildUIElement(ELEMENT_TYPES.DIV, { attributes: { class: classAttr } });

  const buildCurrentPlayerDisplay = (classAttr = GAME.CLASSES.PLAYER_DISPLAY) =>
    buildUIElement(ELEMENT_TYPES.H2, { attributes: { class: classAttr } });

  const buildBoardContainer = (classAttr = GAME.CLASSES.BOARD_CONTAINER) =>
    buildUIElement(ELEMENT_TYPES.DIV, { attributes: { class: classAttr } });

  const buildFleetShipElementArray = (shipInfo, element) =>
    shipInfo.map((info) => buildShip(info.health, info.name, element));

  const populateFleetList = (shipElementArray, container) =>
    shipElementArray.forEach((ship) => container.append(ship));

  const buildAndPopulateFleet = (fleet, container, type) => {
    const shipElements = buildFleetShipElementArray(fleet, type);
    populateFleetList(shipElements, container);
  };

  const buildGameBoardElement = (boardOptions, playerID, playerFleet) => {
    const board = buildGameBoard(boardOptions);
    board.setAttribute('data-player', playerID);
    const mainFleetList = board.querySelector(`.${FLEET_LIST.MAIN.CLASS}`);
    const trackingFleetList = board.querySelector(`.${FLEET_LIST.TRACKING.CLASS}`);
    buildAndPopulateFleet(playerFleet, mainFleetList, ELEMENT_TYPES.BUTTON);
    buildAndPopulateFleet(playerFleet, trackingFleetList, ELEMENT_TYPES.DIV);
    elementManager.cacheElement(`${playerID}board`, board);
    return board;
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
    buildAndPopulateFleet,
    initializeBaseInterface,
    reset: () => (document.querySelector('main').textContent = '')
  };
}
