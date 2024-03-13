export const BoardPlacementManager = ({ placementView, placementManagers }) => {
  const { fleet, mainGrid } = placementManagers;

  let isInitialized = false;

  const initializePlacement = () => {
    const onShipSelected = (data) => {
      updateRotateButton(data);
      mainGrid.updateSelectedEntity(data);
    };
    const updateRotateButton = placementView.initialize();
    mainGrid.start();
    fleet.start();
    fleet.onSelected(onShipSelected);
    fleet.onOrientationToggled(mainGrid.updateOrientation);
    fleet.onAllShipsPlaced(mainGrid.toggleSubmit);
    mainGrid.onPlace(fleet.place);
    mainGrid.onSubmit(endTurn);
    isInitialized = true;
  };

  const startTurn = () => {
    initializePlacement();
    placementView.startTurn();
  };
  const endTurn = () => {
    placementView.endTurn();
    endPlacement();
  };

  const endPlacement = () => {
    if (!isInitialized) return;
    if (!fleet.isAllShipsPlaced()) throw new Error('Not all ships have been placed');
    mainGrid.end();
    fleet.end();
    isInitialized = false;
  };

  isInitialized = true;

  return {
    startTurn,
    endTurn
  };
};
