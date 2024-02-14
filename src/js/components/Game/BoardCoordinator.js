import { MAIN_GRID, TRACKING_GRID } from '../../utility/constants/components/grids';
import { COMMON_ELEMENTS } from '../../utility/constants/dom/elements';
import { buildUIElement } from '../../utility/uiBuilderUtils/uiBuilders';
const BOARD_CONTAINER = 'board';
const buildBoardContainer = () =>
  buildUIElement(COMMON_ELEMENTS.DIV, { attributes: { class: BOARD_CONTAINER } });

// const handlePlacementSubmission = () => {
//   const placements = new Map();
//   _model.getFleet().forEach((ship) => {
//     const startCoordinates = convertToInternalFormat(ship.placedCoordinates[0]);
//     const endCoordinates = convertToInternalFormat(
//       ship.placedCoordinates[ship.placedCoordinates.length - 1]
//     );
//     placements.set(ship.id, { start: startCoordinates, end: endCoordinates });
//   });
//   dispatch.submitPlacements(placements);
// };

const buildSubmitPlacementsButton = () =>
  buildUIElement(COMMON_ELEMENTS.BUTTON, {
    text: 'Submit Placements',
    attributes: { class: 'submit-ships-placement-button', disabled: 'true' }
  });

export const BoardCoordinator = ({
  mainGridController,
  trackingGridController,
  fleetController
}) => {
  const _mainGridController = mainGridController;
  const _trackingGridController = trackingGridController;
  const _fleetController = fleetController;
  const boardContainer = buildBoardContainer();
  const main = document.querySelector('main');
  main.append(boardContainer);
  _mainGridController.displayGrid(boardContainer);
  _trackingGridController.displayGrid(boardContainer);
  const mainGridWrapper = document.querySelector(`.${MAIN_GRID.CLASSES.WRAPPER}`);
  _fleetController.displayMainFleet(mainGridWrapper);
};
