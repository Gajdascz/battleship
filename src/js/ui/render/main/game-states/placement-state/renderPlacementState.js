import { getPlacementStateInstructions, getSubmitShipsPlacementButton } from '../../../../gameStateElements';
import fleetPlacementStateManager from './fleet-placement/fleetPlacementStateManager';
import fleetPlacementStateListeners from './fleet-placement/fleetPlacementStateListeners';
import gridPlacementStateManager from './grid-placement/gridPlacementStateManager';
import gridPlacementStateListeners from './grid-placement/gridPlacementStateListeners';

export default function renderPlacementState(board, shipListContainer, onPlacementSubmission) {
  const mainGrid = board.querySelector('.main-grid');
  const submitPlacementsButton = getSubmitShipsPlacementButton();
  const trackingGridWrapper = board.querySelector('.tracking-grid-wrapper');
  const placementInstructions = getPlacementStateInstructions();
  trackingGridWrapper.classList.add('hide');
  board.append(placementInstructions);
  shipListContainer.append(submitPlacementsButton);
  const shipListButtons = shipListContainer.querySelectorAll('button.fleet-entry');
  const fleetPlacementManager = fleetPlacementStateManager(shipListContainer, submitPlacementsButton);
  const fleetPlacementListeners = fleetPlacementStateListeners(fleetPlacementManager);
  const gridPlacementManager = gridPlacementStateManager(mainGrid, board.dataset.letterAxis);
  const gridPlacementListeners = gridPlacementStateListeners(gridPlacementManager);
  fleetPlacementListeners.init();
  gridPlacementListeners.init();
  const disableFleetList = () => shipListButtons.forEach((button) => button.setAttribute('disabled', true));
  document.addEventListener('placementsSubmitted', onPlacementSubmission);
  return {
    clearState: function () {
      fleetPlacementListeners.remove();
      gridPlacementListeners.remove();
      document.removeEventListener('placementsSubmitted', onPlacementSubmission);
      trackingGridWrapper.classList.remove('hide');
      placementInstructions.remove();
      submitPlacementsButton.remove();
      disableFleetList();
    }
  };
}
