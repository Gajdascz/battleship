import { convertToInternalFormat } from '../../../../utility/coordinatesConverters';

/**
 * Handles all logic to handle events related to ship elements and their placement.
 * Provides logic to update ship HTML elements when rotated, placed, selected, and placement submission.
 * @param {element} container    - HTML container for list of ship elements.
 * @param {element} submitButton - Placement submission button.
 * @returns {object} - Provides functions for handling events.
 */
export default function fleetPlacementStateManager(fleetManager, submitButton, rotateButton) {
  const _submitButton = submitButton;
  const _rotateShipButton = rotateButton;
  fleetManager.startPlacementState();

  // Enables the submit button if all ships are placed, otherwise disables it.
  const updateSubmitButtonState = () => {
    const areAllShipsPlaced = fleetManager.allShipsPlaced();
    _submitButton.disabled = !areAllShipsPlaced;
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

  return {
    get submitButton() {
      return _submitButton;
    },
    get rotateButton() {
      return _rotateShipButton;
    },
    shipPlaced,
    updateSubmitButtonState
  };
}
