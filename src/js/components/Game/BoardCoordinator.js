import { buildUIElement } from '../../builders/utility/uiBuilders';
import { MAIN_GRID, TRACKING_GRID } from '../../utility/constants/components/grids';
import { COMMON_ELEMENTS } from '../../utility/constants/dom/elements';

const BOARD_CONTAINER = 'board';
const buildBoardContainer = () =>
  buildUIElement(COMMON_ELEMENTS.DIV, { attributes: { class: BOARD_CONTAINER } });

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
