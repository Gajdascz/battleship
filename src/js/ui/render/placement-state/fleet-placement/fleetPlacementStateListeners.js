/**
 * Manages the creation of event listeners for selecting and manipulating ship dom elements for placement.
 * This function sets up the necessary event listeners to handle ship selection,
 * orientation changing, fleet display interaction, and ship element updating.
 *
 * @param {object} fleetPlacementManager - Object for managing the state and logic of ship elements.
 * @returns {object} - Object for initializing and removing all related event listeners.
 */
export default function fleetPlacementStateListeners(fleetPlacementManager) {
  // Returned object for initializing and removing all grid placement event listeners.
  const listeners = {
    init: function () {
      // Listens for ship rotation change events from button-0, Space, and KeyR.
      document.addEventListener('mousedown', fleetPlacementManager.shipRotated);
      document.addEventListener('keydown', fleetPlacementManager.shipRotated);
      // Listens for ship selection and placement events.
      document.addEventListener('shipSelected', fleetPlacementManager.shipSelected);
      document.addEventListener('shipPlaced', fleetPlacementManager.shipPlaced);
      // Listens for click event on submit button to finalize ship placements.
      fleetPlacementManager.submitButton.addEventListener('click', fleetPlacementManager.submitPlacements);
    },
    remove: function () {
      document.removeEventListener('mousedown', fleetPlacementManager.shipRotated);
      document.removeEventListener('keydown', fleetPlacementManager.shipRotated);
      document.removeEventListener('shipSelected', fleetPlacementManager.shipSelected);
      document.removeEventListener('shipPlaced', fleetPlacementManager.shipPlaced);
      document.removeEventListener('placementsSubmitted', fleetPlacementManager.submitPlacements);
      fleetPlacementManager.submitButton.removeEventListener('click', fleetPlacementManager.submitPlacements);
    }
  };

  return listeners;
}
