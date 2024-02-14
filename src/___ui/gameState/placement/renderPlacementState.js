import {
  getPlacementStateInstructions,
  getSubmitShipsPlacementButton,
  shipRotationButton
} from '../gameStateElements';
import gridPlacementStateManager from './grid/gridPlacementStateManager';
import gridPlacementStateListeners from './grid/gridPlacementStateListeners';
import { SHIP } from '../../common/constants/shipConstants';

export default function renderPlacementState(board, fleetManager, onPlacementSubmission) {
  fleetManager.startPlacementState();
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
  const gridPlacementManager = gridPlacementStateManager(mainGrid, board.dataset.letterAxis);
  const gridPlacementListeners = gridPlacementStateListeners(gridPlacementManager);
  gridPlacementListeners.init();
  const checkPlacements = () => {
    if (fleetManager.allShipsPlaced()) submitPlacementsButton.removeAttribute('disabled');
    else submitPlacementsButton.setAttribute('disabled', '');
  };

  const handlePlacementsSubmitted = (e) => {
    fleetManager.startProgressState();
    onPlacementSubmission(e);
  };

  document.addEventListener(SHIP.EVENTS.PLACED_SUCCESS, checkPlacements);
  submitPlacementsButton.addEventListener('click', fleetManager.submitPlacements);
  document.addEventListener('placementsSubmitted', handlePlacementsSubmitted);
  return {
    clearState: function () {
      //   fleetPlacementListeners.remove();
      gridPlacementListeners.remove();
      document.removeEventListener('placementsSubmitted', handlePlacementsSubmitted);
      trackingGridWrapper.classList.remove('hide');
      placementInstructions.remove();
      submitPlacementsButton.remove();
      rotateShipButton.remove();
      //  disableFleetList();
    }
  };
}
