export const BoardPlacementManager = ({
  placementView,
  placementManagers,
  placementCoordinator,
  resetController
}) => {
  const { fleet, mainGrid } = placementManagers;
  const { call, extend, BASE_METHODS, reset } = placementCoordinator;

  let isInitialized = false;
  const callStartTurn = () => call(BASE_METHODS.START_TURN);
  const callEndTurn = () => call(BASE_METHODS.END_TURN);
  const callInitialize = () => call(BASE_METHODS.INITIALIZE);

  extend(BASE_METHODS.INITIALIZE, {
    post: () => {
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
  extend(BASE_METHODS.START_TURN, {
    post: () => placementView.startTurn()
  });
  extend(BASE_METHODS.END_TURN, {
    post: () => {
      if (!isInitialized) return;
      if (!fleet.isAllShipsPlaced()) throw new Error('Not all ships have been placed');
      mainGrid.end();
      fleet.end();
      placementView.endTurn();
      isInitialized = false;
    }
  });

  isInitialized = true;
  callInitialize();

  return {
    startTurn: callStartTurn,
    endTurn: callEndTurn,
    isOver: () => fleet.isAllShipsPlaced(),
    destruct: () => {
      reset();
      resetController();
    }
  };
};
