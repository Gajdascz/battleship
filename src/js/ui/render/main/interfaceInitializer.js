import buildGameBoard from '../../game-board/buildGameBoard';
import buildShip from '../../ship/buildShip';
import buildBasicUIElement from '../../utility-ui/buildBasicUIElement';

export default function InterfaceInitializer() {
  const buildGameContainer = (classAttr = 'game-container') => {
    return buildBasicUIElement({ type: 'div', attributes: { class: classAttr } });
  };
  const buildCurrentPlayerDisplay = (classAttr = 'current-player-display') => {
    return buildBasicUIElement({ type: 'h2', attributes: { class: classAttr } });
  };
  const buildBoardContainer = (classAttr = 'board-container') => {
    return buildBasicUIElement({ type: 'div', attributes: { class: classAttr } });
  };

  const buildFleetShipElementArray = (shipInfo, element) => {
    return shipInfo.map((info) => buildShip(info.health, info.name, element));
  };

  const populateFleetList = (shipElementArray, container) => shipElementArray.forEach((ship) => container.append(ship));

  const buildAndPopulateFleet = (fleet, container, type) => {
    const shipElements = buildFleetShipElementArray(fleet, type);
    populateFleetList(shipElements, container);
  };

  const buildGameBoardElement = (boardOptions, playerID, playerFleet) => {
    const board = buildGameBoard(boardOptions);
    board.setAttribute('data-player', playerID);
    const mainFleetList = board.querySelector('.main-fleet-list');
    const trackingFleetList = board.querySelector('.tracking-fleet-list');
    buildAndPopulateFleet(playerFleet, mainFleetList, 'button');
    buildAndPopulateFleet(playerFleet, trackingFleetList, 'div');
    return board;
  };

  const initializeBaseInterface = (elementManager = null) => {
    const MAIN = document.querySelector('main');
    const gameContainer = buildGameContainer('game-container');
    const currentPlayerDisplay = buildCurrentPlayerDisplay('current-player-display');
    const boardContainer = buildBoardContainer('board-container');
    if (elementManager) {
      elementManager.cacheElement('boardContainer', boardContainer);
      elementManager.cacheElement('currentPlayerDisplay', currentPlayerDisplay);
    }
    MAIN.append(gameContainer);
    gameContainer.append(currentPlayerDisplay, boardContainer);
  };

  return {
    buildGameContainer,
    buildCurrentPlayerDisplay,
    buildBoardContainer,
    buildGameBoardElement,
    buildAndPopulateFleet,
    initializeBaseInterface
  };
}
