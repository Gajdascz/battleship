import {
  getPlacementStateInstructions,
  getSubmitShipsPlacementButton,
  shipRotationButton
} from '../gameStateElements';
import fleetPlacementStateManager from './fleet/fleetPlacementStateManager';
import fleetPlacementStateListeners from './fleet/fleetPlacementStateListeners';
import gridPlacementStateManager from './grid/gridPlacementStateManager';
import gridPlacementStateListeners from './grid/gridPlacementStateListeners';

export default function renderPlacementState(board, shipListContainer, onPlacementSubmission) {
  console.log(shipListContainer);
  const mainGrid = board.querySelector('.main-grid');
  const submitPlacementsButton = getSubmitShipsPlacementButton();
  const rotateShipButton = shipRotationButton();
  const trackingGridWrapper = board.querySelector('.tracking-grid-wrapper');
  const placementInstructions = getPlacementStateInstructions();
  const fleetListButtonContainer = board.querySelector('.fleet-list-button-container');
  trackingGridWrapper.classList.add('hide');
  board.append(placementInstructions);
  fleetListButtonContainer.append(submitPlacementsButton);
  fleetListButtonContainer.append(rotateShipButton);
  const shipListButtons = shipListContainer.querySelectorAll('button.fleet-entry');
  const fleetPlacementManager = fleetPlacementStateManager(
    shipListContainer,
    submitPlacementsButton,
    rotateShipButton
  );
  const fleetPlacementListeners = fleetPlacementStateListeners(fleetPlacementManager);
  const gridPlacementManager = gridPlacementStateManager(mainGrid, board.dataset.letterAxis);
  const gridPlacementListeners = gridPlacementStateListeners(gridPlacementManager);
  fleetPlacementListeners.init();
  gridPlacementListeners.init();
  const disableFleetList = () =>
    shipListButtons.forEach((button) => button.setAttribute('disabled', true));

  document.addEventListener('placementsSubmitted', onPlacementSubmission);
  return {
    clearState: function () {
      fleetPlacementListeners.remove();
      gridPlacementListeners.remove();
      document.removeEventListener('placementsSubmitted', onPlacementSubmission);
      trackingGridWrapper.classList.remove('hide');
      placementInstructions.remove();
      submitPlacementsButton.remove();
      rotateShipButton.remove();
      disableFleetList();
    }
  };
}
