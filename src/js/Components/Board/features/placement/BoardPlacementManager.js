export const BoardPlacementManager = ({
  placementView,
  placementManagers,
  placementCoordinator
}) => {
  const { fleet, mainGrid } = placementManagers;
  const { BASE_METHODS } = placementCoordinator;
  let isInitialized = false;

  const callStartTurn = () => placementCoordinator.call(BASE_METHODS.START_TURN);
  const callEndTurn = () => placementCoordinator.call(BASE_METHODS.END_TURN);
  const callInitialize = () => placementCoordinator.call(BASE_METHODS.INITIALIZE);
  const callIsOver = () => placementCoordinator.call(BASE_METHODS.IS_OVER);

  placementCoordinator.extend(BASE_METHODS.INITIALIZE, {
    pre: () => {
      if (isInitialized) return;
      const onShipSelected = (data) => {
        console.log(data);
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
      isInitialized = true;
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
    }
  });

  return {
    initialize: () => callInitialize(),
    startTurn: () => callStartTurn(),
    endTurn: () => callEndTurn(),
    isOver: () => callIsOver()
  };
};
