export const BoardPlacementManager = ({
  placementView,
  placementManagers,
  placementCoordinator,
  resetController
}) => {
  const { fleet, mainGrid } = placementManagers;
  const { BASE_METHODS } = placementCoordinator;
  let isInitialized = false;
  let isOver = false;
  const callStartTurn = () => placementCoordinator.call(BASE_METHODS.START_TURN);
  const callEndTurn = () => placementCoordinator.call(BASE_METHODS.END_TURN);
  const callInitialize = () => placementCoordinator.call(BASE_METHODS.INITIALIZE);

  const onEndTurn = (callback) => placementCoordinator.onEndTurn(callback);

  const initialize = () => {
    if (isInitialized) return;
    placementCoordinator.extend(BASE_METHODS.INITIALIZE, {
      pre: () => {
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
        mainGrid.onSubmit(callEndTurn);
      }
    });
    placementCoordinator.extend(BASE_METHODS.START_TURN, {
      pre: () => placementView.startTurn()
    });
    placementCoordinator.extend(BASE_METHODS.END_TURN, {
      pre: () => {
        if (!isInitialized) return;
        if (!fleet.isAllShipsPlaced()) throw new Error('Not all ships have been placed');
        mainGrid.end();
        fleet.end();
        placementView.endTurn();
        isInitialized = false;
        isOver = true;
      }
    });
    isInitialized = true;
    callInitialize();
  };

  const destruct = () => {
    placementCoordinator.reset();
    resetController();
  };

  return {
    initialize,
    startTurn: () => callStartTurn(),
    endTurn: () => callEndTurn(),
    onEndTurn,
    isOver: () => isOver && fleet.isAllShipsPlaced(),
    destruct
  };
};
