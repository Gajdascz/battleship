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
    mainGrid.onPlacementsSubmitted(onEnd);
    componentEmitter.unsubscribe(BOARD_PLACEMENT_EVENTS.START, onInitialize);
  };

  const onEnd = () => {
    if (!fleet.isAllShipsPlaced()) throw new Error('Not all ships have been placed');
    mainGrid.end();
    fleet.end();
    placementView.endTurn();
    componentEmitter.publish(BOARD_PLACEMENT_EVENTS.END);
  };

  componentEmitter.subscribe(BOARD_PLACEMENT_EVENTS.START, onInitialize);
};
