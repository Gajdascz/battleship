/**
 * Orchestrates the board's placement phase through the component managers and provided communication method.
 *
 * @param {Object} detail Initialization detail containing the board's placementView and component placement managers.
 * @returns {Object} Methods for starting and ending the placement phase.
 */
export const BoardPlacementManager = ({ placementView, placementManagers }) => {
  const { fleet, mainGrid } = placementManagers;

  let isInitialized = false;

  /**
   * Initializes the placement phases functionality.
   *
   * @param {function} handleFinalize Callback to communicate that the board's placements are finalized (phase is over).
   */
  const initializePlacement = (handleFinalize) => {
    const { updateRotateButton, removeRotateButton } = placementView.init();
    mainGrid.start();
    fleet.start();
    const onShipSelected = (data) => {
      updateRotateButton(data);
      mainGrid.updateSelectedEntity(data);
    };
    const onShipPlaced = (placementData) => {
      fleet.place(placementData);
      removeRotateButton();
    };
    fleet.onSelected(onShipSelected);
    fleet.onOrientationToggled(mainGrid.updateOrientation);
    fleet.onAllShipsPlaced(mainGrid.toggleSubmit);
    mainGrid.onPlace(onShipPlaced);
    mainGrid.onSubmit(handleFinalize);
    isInitialized = true;
  };

  /**
   * Ends the placement phase and cleans the state.
   *
   * @param {function} isFinalizeRequest Function to check if the request is from finalization.
   */
  const endPlacement = (isFinalizeRequest) => {
    if (!isInitialized) return;
    if (isFinalizeRequest && !fleet.isAllShipsPlaced())
      throw new Error('Not all ships have been placed');
    placementView.endTurn();
    mainGrid.end();
    fleet.end();
    isInitialized = false;
  };

  /**
   * Provides the finalize communication method and updates the interface.
   *
   * @param {function} onFinalize Function to communicate that the placement phase is over.
   */
  const startPlacement = (onFinalize) => {
    const handleFinalize = () => {
      endPlacement(true);
      if (onFinalize) onFinalize();
    };
    initializePlacement(handleFinalize);
    placementView.startTurn();
  };

  return {
    startPlacement,
    endPlacement
  };
};
