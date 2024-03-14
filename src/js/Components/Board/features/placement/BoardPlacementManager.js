export const BoardPlacementManager = ({ placementView, placementManagers }) => {
  const { fleet, mainGrid } = placementManagers;

  let isInitialized = false;

  const initializePlacement = (handleFinalize) => {
    const { updateRotateButton, removeRotateButton } = placementView.initialize();
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

  const endPlacement = () => {
    if (!isInitialized) return;
    if (!fleet.isAllShipsPlaced()) throw new Error('Not all ships have been placed');
    placementView.endTurn();
    mainGrid.end();
    fleet.end();
    isInitialized = false;
  };

  const startPlacement = (onFinalize) => {
    const handleFinalize = () => {
      if (onFinalize) onFinalize();
      endPlacement();
    };
    initializePlacement(handleFinalize);
    placementView.startTurn();
  };

  return {
    startPlacement,
    endPlacement
  };
};
