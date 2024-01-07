/**
 * Manages the creation of event listeners for placing ships in the main grid
 * This function sets up the necessary event listeners to handle ship placement,
 * orientation changes, and managing the display of placement previews.
 *
 * @param {object} gridPlacementManager - Object for managing the state and logic of grid placement.
 * @returns {object} - Object for initializing and removing all related event listeners.
 */
export default function createGridPlacementStateListeners(gridPlacementManager) {
  // Returns closest ancestor of event target. Used for event delegation.
  const getTarget = (e) => e.target.closest('.grid-cell');

  // Handles placement request logic. Triggered when a grid cell is clicked.
  const processPlacementRequest = (e) => {
    const target = getTarget(e);
    if (!target) return;
    gridPlacementManager.processPlacementRequest(e, target);
  };

  // Displays a preview of the ship placement. Triggered when hovering over a grid cell.
  const showPlacementPreview = (e) => {
    const target = getTarget(e);
    if (!target) return;
    gridPlacementManager.showPlacementPreview(target);
  };

  // Returned object for initializing and removing all grid placement event listeners.
  const listeners = {
    init: function () {
      // Listens for ship selection and orientation change.
      document.addEventListener('shipSelected', gridPlacementManager.shipSelected);
      document.addEventListener('shipOrientationChanged', gridPlacementManager.updateGridOnOrientationChange);
      // Adds listeners to the grid for delegating click and mouseover events.
      gridPlacementManager.grid.addEventListener('click', processPlacementRequest);
      gridPlacementManager.grid.addEventListener('mouseover', showPlacementPreview);
      // Adds listeners to each cell for clearing placement preview.
      gridPlacementManager.grid
        .querySelectorAll('.grid-cell')
        .forEach((cell) => cell.addEventListener('mouseout', gridPlacementManager.clearPlacementPreview));
    },
    remove: function () {
      document.removeEventListener('shipSelected', gridPlacementManager.shipSelected);
      document.removeEventListener('shipOrientationChanged', gridPlacementManager.updateGridOnOrientationChange);
      gridPlacementManager.grid.removeEventListener('click', processPlacementRequest);
      gridPlacementManager.grid.removeEventListener('mouseover', showPlacementPreview);
      gridPlacementManager.grid
        .querySelectorAll('.grid-cell')
        .forEach((cell) => cell.removeEventListener('mouseout', gridPlacementManager.clearPlacementPreview));
    }
  };

  return listeners;
}
