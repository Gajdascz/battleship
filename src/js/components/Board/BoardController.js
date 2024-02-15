import { MAIN_GRID, TRACKING_GRID } from '../../utility/constants/components/grids';
import { COMMON_ELEMENTS } from '../../utility/constants/dom/elements';
import { buildUIElement } from '../../utility/uiBuilderUtils/uiBuilders';
import { BoardView } from './BoardView';

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

export const BoardController = (componentControllers) => {
  const { mainGridController, trackingGridController, fleetController } = componentControllers;
  const view = BoardView(
    mainGridController.getView(),
    trackingGridController.getView(),
    fleetController.getView()
  );

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
