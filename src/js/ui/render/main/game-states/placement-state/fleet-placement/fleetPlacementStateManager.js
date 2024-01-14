// import { convertToInternalFormat } from '../../../../utility/coordinatesConverters';

import { convertToInternalFormat } from '../../../../../../utility/coordinatesConverters';

/**
 * Handles all logic to handle events related to ship elements and their placement.
 * Provides logic to update ship HTML elements when rotated, placed, selected, and placement submission.
 * @param {element} container    - HTML container for list of ship elements.
 * @param {element} submitButton - Placement submission button.
 * @returns {object} - Provides functions for handling events.
 */
export default function fleetPlacementStateManager(container, submitButton) {
  const _allShips = [...container.querySelectorAll('.fleet-entry')];
  const _shipListContainer = container;
  const _submitButton = submitButton;
  const _placedShips = new Map();
  const getActiveShip = () => _shipListContainer.querySelector('.being-placed');

  // Enables the submit button if all ships are placed, otherwise disables it.
  const updateSubmitButtonState = () => {
    const allShipsPlaced = _allShips.every((ship) => ship.dataset.placed === 'true');
    _submitButton.disabled = !allShipsPlaced;
  };

  const validateShipPlacementStates = () => _allShips.length === _placedShips.size;

  /**
   * Updates the rotated ship's element attributes and dispatches orientationChangeEvent.
   * Triggered by Space, KeyR, and button 1.
   * @param {event} e - Click or keydown event triggering ship rotation request.
   */
  const shipRotated = (e) => {
    if (!(e.code === 'Space' || e.code === 'KeyR' || e.button === 1)) return;
    e.preventDefault();
    const activeShip = getActiveShip();
    if (activeShip) {
      const currentOrientation = activeShip.dataset.orientation;
      const newOrientation = currentOrientation === 'vertical' ? 'horizontal' : 'vertical';
      activeShip.dataset.orientation = newOrientation;
      const orientationChangeEvent = new CustomEvent('shipOrientationChanged', {
        detail: { name: activeShip.dataset.name, newOrientation }
      });
      document.dispatchEvent(orientationChangeEvent);
    }
  };

  /**
   * Updates the selected ship element's attributes and submit button state.
   * @param {event} e - shipSelected event trigger containing selected ship details.
   */
  const shipSelected = (e) => {
    const { element } = e.detail;
    _allShips.forEach((ship) => ship.classList.toggle('being-placed', ship === element));
    _placedShips.delete(element.dataset.name);
    element.dataset.placed = false;
    updateSubmitButtonState();
  };

  /**
   * Updates placed ship's element attributes, formats placement coordinates for processing,
   * pushes it to the placed ships array, and updates the submit button state.
   * @param {event} e - shipPlaced event trigger containing placed ship details.
   */
  const shipPlaced = (e) => {
    const { shipElement, placedCoordinates, shipName } = e.detail;
    shipElement.dataset.placed = true;
    shipElement.classList.remove('being-placed');
    let coordinates = placedCoordinates.map((coordinates) => convertToInternalFormat(coordinates));
    coordinates = { start: coordinates[0], end: coordinates[coordinates.length - 1] };
    _placedShips.set(shipName, coordinates);
    updateSubmitButtonState();
  };

  /**
   * Dispatches placementsSubmitted event when submit button is clicked.
   * Provides detail object containing all placed ship's relevant information.
   */
  const submitPlacements = () => {
    if (validateShipPlacementStates()) {
      const event = new CustomEvent('placementsSubmitted', {
        detail: {
          placements: _placedShips
        }
      });
      document.dispatchEvent(event);
    }
  };
  return {
    get shipListContainer() {
      return _shipListContainer;
    },
    get submitButton() {
      return _submitButton;
    },
    shipRotated,
    shipSelected,
    shipPlaced,
    updateSubmitButtonState,
    submitPlacements
  };
}
