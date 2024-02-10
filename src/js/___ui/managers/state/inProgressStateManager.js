import { RESULTS } from '../../../utility/constants';
import {
  convertToInternalFormat,
  convertToDisplayFormat
} from '../../../utility/utils/coordinatesUtils';

const getBoardGrids = (board) => {
  const aiDisplay = board.querySelector('.ai-display-tracking-grid');
  return {
    main: board.querySelector('.main-grid'),
    tracking: board.querySelector('.tracking-grid'),
    ...(aiDisplay && { aiDisplay })
  };
};
const getBoardFleetElements = (board) => {
  const mainFleetList = board.querySelector('.main-fleet-list-container');
  const trackingFleetList = board.querySelector('.tracking-fleet-list-container');
  const ownFleet = new Map();
  const opponentFleet = new Map();
  mainFleetList
    .querySelectorAll('.fleet-entry')
    .forEach((shipElement) => ownFleet.set(shipElement.dataset.name, shipElement));
  trackingFleetList
    .querySelectorAll('.fleet-entry')
    .forEach((shipElement) => opponentFleet.set(shipElement.dataset.name, shipElement));
  return {
    ownFleet,
    opponentFleet
  };
};

export default function inProgressStateManager(p1Board, p2Board) {
  const p1Grids = getBoardGrids(p1Board);
  const p2Grids = getBoardGrids(p2Board);
  if (p1Grids.aiDisplay && p2Grids.tracking === null) p2Grids.tracking = p1Grids.aiDisplay;
  const p1FleetLists = getBoardFleetElements(p1Board);
  const p2FleetLists = getBoardFleetElements(p2Board);
  const isLetterRow = p1Board.dataset.letterAxis === 'row';
  const getTrackingCell = (grid, coords) =>
    grid.querySelector(`button[value="${coords[0]}${coords[1]}"]`);
  const getMainCell = (grid, coords) =>
    grid.querySelector(`div[data-coordinates="${coords[0]}${coords[1]}"]`);
  const displayMiss = (trackingCell) => (trackingCell.dataset.cellStatus = 'miss');
  const setShipElementSunk = (element) => (element.dataset.sunk = true);

  const displayHit = (trackingCell, opponentCell) => {
    trackingCell.dataset.cellStatus = 'hit';
    opponentCell.classList.add('main-grid-hit-marker');
  };

  const displayShipSunk = (attackingPlayerID, sunkShipName) => {
    const attackerFleetList = attackingPlayerID === 'playerOne' ? p1FleetLists : p2FleetLists;
    const sunkenShipFleetList = attackingPlayerID === 'playerOne' ? p2FleetLists : p1FleetLists;
    setShipElementSunk(attackerFleetList.opponentFleet.get(sunkShipName));
    setShipElementSunk(sunkenShipFleetList.ownFleet.get(sunkShipName));
  };

  function sendAttack(e) {
    const target = e.target.closest('button.grid-cell');
    if (!target) return;
    const coordinates = convertToInternalFormat(target.value);
    if (target.dataset.cellStatus === 'unexplored') {
      target.setAttribute('disabled', true);
      document.dispatchEvent(
        new CustomEvent('playerAttacked', {
          detail: {
            coordinates
          }
        })
      );
    }
  }
  function renderProcessedAttack(e) {
    const { attackingPlayer, result, coordinates, sunkShipName } = e.detail;
    const displayCoordinates = convertToDisplayFormat(coordinates[0], coordinates[1], isLetterRow);
    const attackingPlayerTrackingGrid =
      attackingPlayer.id === 'playerOne' ? p1Grids.tracking : p2Grids.tracking;
    const trackingCell = getTrackingCell(attackingPlayerTrackingGrid, displayCoordinates);
    if (result === RESULTS.MISS) displayMiss(trackingCell);
    else {
      const opponentCell =
        attackingPlayer.id === 'playerOne'
          ? getMainCell(p2Grids.main, displayCoordinates)
          : getMainCell(p1Grids.main, displayCoordinates);
      displayHit(trackingCell, opponentCell);
      if (result === RESULTS.SHIP_SUNK || result === RESULTS.ALL_SHIPS_SUNK) {
        displayShipSunk(attackingPlayer.id, sunkShipName);
      }
    }
  }

  return {
    sendAttack,
    renderProcessedAttack,
    get p1TrackingGrid() {
      return p1Grids.tracking;
    },
    get p2TrackingGrid() {
      return p2Grids.tracking;
    }
  };
}
