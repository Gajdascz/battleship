import { buildGameBoardObj } from './buildGameBoardObj';
import { BOARD, GRID } from '../common/uiConstants';
import { uiObjToElement } from '../common/uiUtility';
import { isHTMLElement } from '../managers/managerUtilities';

/**
 * Builds and returns the board interface object.
 *
 * @param {Object} param Object containing board configuration data.
 * @returns {HTMLElement} Board interface element.
 */
export const BoardController = ({ rows = 10, cols = 10, letterAxis = 'row' } = {}) => {
  const boardElement = uiObjToElement(buildGameBoardObj(rows, cols, letterAxis));
  isHTMLElement(boardElement);

  const getElement = (classAttribute) => boardElement.querySelector(`.${classAttribute}`);
  const getGridCellMap = (grid, attribute) => {
    const cellsArray = [...grid.querySelectorAll(BOARD.SELECTORS.GRIDS.COMMON.CELL())];
    const cellMap = new Map();
    cellsArray.forEach((cell) => {
      const cellKey = cell.getAttribute(attribute);
      cellMap.set(cellKey, cell);
    });
    return cellMap;
  };
  const grids = {
    main: getElement(BOARD.CLASSES.GRIDS.MAIN),
    tracking: getElement(BOARD.CLASSES.GRIDS.TRACKING)
  };
  const cellMaps = {
    main: getGridCellMap(grids.main, GRID.MAIN.ATTRIBUTES.COORDINATES),
    tracking: getGridCellMap(grids.tracking, GRID.TRACKING.ATTRIBUTES.VALUE)
  };
  const fleetListContainers = {
    main: getElement(BOARD.CLASSES.FLEETS.MAIN_LIST),
    tracking: getElement(BOARD.CLASSES.FLEETS.TRACKING_LIST)
  };

  const populateFleetLists = (playerShipElements, enemyShipElements) => {
    playerShipElements.forEach((shipElement) => fleetListContainers.main.append(shipElement));
    enemyShipElements.forEach((shipElement) => fleetListContainers.tracking.append(shipElement));
  };
  const addAIDisplay = (aiDisplay) =>
    getElement(BOARD.CLASSES.GRIDS.TRACKING_WRAPPER).append(aiDisplay);

  const setTrackingCellToMiss = (coordinates) => {
    const cell = cellMaps.tracking.get(coordinates);
    cell.dataset.cellStatus = BOARD.COMMON.CELL_STATUS.MISS;
  };

  const setTrackingCellToHit = (coordinates) => {
    const cell = cellMaps.tracking.get(coordinates);
    cell.dataset.cellStatus = BOARD.COMMON.CELL_STATUS.HIT;
  };

  const setMainCellToHit = (coordinates) => {
    const cell = cellMaps.main.get(coordinates);
    cell.classList.add(BOARD.CLASSES.GRIDS.MAIN_GRID_HIT);
  };

  const sendAttack = (target) => {
    if (target.dataset.cellStatus === BOARD.COMMON.CELL_STATUS.UNEXPLORED) {
      target.setAttribute('disabled', true);
      document.dispatchEvent(
        new CustomEvent(BOARD.EVENTS.PLAYER_ATTACKED, {
          detail: {
            coordinates: target.value
          }
        })
      );
    }
  };

  return {
    element: boardElement,
    isLetterRow: boardElement.dataset.letterAxis === BOARD.COMMON.LETTER_AXIS.ROW,
    assignID: (id) => boardElement.setAttribute(BOARD.ATTRIBUTES.ASSIGNED_PLAYER_ID, id),
    sendAttack,
    setTrackingCellToHit,
    setTrackingCellToMiss,
    setMainCellToHit,
    populateFleetLists,
    addAIDisplay
  };
};

// const processIncomingHit = (coordinates) => {
//   const displayCoordinates = convertToDisplayFormat(coordinates[0], coordinates[1], isLetterRow);
//   setMainCellToHit(displayCoordinates);
// };

// const processOutgoingAttack = (coordinates, result) => {
//   const displayCoordinates = convertToDisplayFormat(coordinates[0], coordinates[1], isLetterRow);
//   if (result === 'miss') setTrackingCellToMiss(displayCoordinates);
//   else setTrackingCellToHit(displayCoordinates);
// };
