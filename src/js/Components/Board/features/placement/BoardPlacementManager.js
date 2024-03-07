import { BOARD_PLACEMENT_EVENTS } from '../../common/boardEvents';

export const BoardPlacementManager = ({ placementView, placementManagers, componentEmitter }) => {
  const { fleet, mainGrid } = placementManagers;
  let isInitialized = false;
  const onInitialize = () => {
    if (isInitialized) return;
    const onShipSelected = (data) => {
      updateRotateButton(data);
      mainGrid.updateSelectedEntity(data);
    };
    const updateRotateButton = placementView.startTurn();
    mainGrid.start();
    fleet.start();
    console.log(mainGrid);
    fleet.onSelect(onShipSelected);
    fleet.onOrientationToggle(mainGrid.updateOrientation);
    fleet.onAllShipsPlaced(mainGrid.enableSubmit);
    mainGrid.onPlace(fleet.setCoordinates);
    mainGrid.onSubmit(onEnd);
    componentEmitter.unsubscribe(BOARD_PLACEMENT_EVENTS.START, onInitialize);
    isInitialized = true;
  };

  const onEnd = () => {
    if (!isInitialized) return;
    if (!fleet.isAllShipsPlaced()) throw new Error('Not all ships have been placed');
    mainGrid.end();
    fleet.end();
    placementView.endTurn();
    componentEmitter.publish(BOARD_PLACEMENT_EVENTS.END);
    isInitialized = false;
  };

  componentEmitter.subscribe(BOARD_PLACEMENT_EVENTS.START, onInitialize);
};
