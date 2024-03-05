import { BOARD_PLACEMENT_EVENTS } from '../../common/boardEvents';

export const BoardPlacementManager = ({
  placementView,
  placementControllers,
  componentEmitter
}) => {
  const { fleet, mainGrid } = placementControllers;

  const onInitialize = () => {
    const onShipSelected = (data) => {
      updateRotateButton(data);
      mainGrid.updateSelectedEntity(data);
    };
    const updateRotateButton = placementView.startTurn();
    mainGrid.initialize();
    fleet.initialize();
    fleet.onSelected(onShipSelected);
    fleet.onOrientationToggled(mainGrid.updateOrientation);
    fleet.onAllShipsPlaced(mainGrid.enableSubmit);
    fleet.onShipNoLongerPlaced(mainGrid.disableSubmit);
    mainGrid.onPlacementProcessed(fleet.setCoordinates);
    componentEmitter.unsubscribe(BOARD_PLACEMENT_EVENTS.START, onInitialize);
    componentEmitter.subscribe(BOARD_PLACEMENT_EVENTS.END, onEnd);
  };

  const onEnd = () => {
    fleet.end();
    mainGrid.end();
    placementView.endTurn();
    componentEmitter.unsubscribe(BOARD_PLACEMENT_EVENTS.END, onEnd);
  };

  componentEmitter.subscribe(BOARD_PLACEMENT_EVENTS.START, onInitialize);
};
