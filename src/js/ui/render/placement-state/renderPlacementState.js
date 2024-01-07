import { getPlacementStateInstructions, getSubmitShipsPlacementButton } from '../renderElements';
import fleetPlacementStateManager from './fleet-placement/fleetPlacementStateManager';
import fleetPlacementStateListeners from './fleet-placement/fleetPlacementStateListeners';
import gridPlacementStateManager from './grid-placement/gridPlacementStateManager';
import gridPlacementStateListeners from './grid-placement/gridPlacementStateListeners';

const initUI = (board, shipListContainer, submitButton) => {
  board.querySelector('.tracking-grid-wrapper').classList.add('hide');
  const placementInstructions = getPlacementStateInstructions();
  board.append(placementInstructions);
  shipListContainer.append(submitButton);
};

export default function renderPlacementState(board, shipListContainer) {
  const mainGrid = board.querySelector('.main-grid');
  const submitPlacementsButton = getSubmitShipsPlacementButton();
  initUI(board, shipListContainer, submitPlacementsButton);
  const fleetPlacementManager = fleetPlacementStateManager(shipListContainer, submitPlacementsButton);
  const fleetPlacementListeners = fleetPlacementStateListeners(fleetPlacementManager);
  const gridPlacementManager = gridPlacementStateManager(mainGrid, board.dataset.letterAxis);
  const gridPlacementListeners = gridPlacementStateListeners(gridPlacementManager);

  fleetPlacementListeners.init();
  gridPlacementListeners.init();
}
