import { BOARD_PLACEMENT_EVENTS } from '../../common/boardEvents';
export const BoardPlacementManager = ({ placementView, placementManagers, emitter }) => {
  const { fleet, mainGrid } = placementManagers;
  console.log(fleet);
  let isInitialized = false;

  const start = () => {
    if (isInitialized) return;
    const onShipSelected = (data) => {
      console.log(data);
      updateRotateButton(data);
      mainGrid.updateSelectedEntity(data);
    };
    const updateRotateButton = placementView.startTurn();
    mainGrid.start();
    fleet.start();
    fleet.onSelected(onShipSelected);
    fleet.onOrientationToggled(mainGrid.updateOrientation);
    fleet.onAllShipsPlaced(mainGrid.toggleSubmit);
    mainGrid.onPlace(fleet.place);
    mainGrid.onSubmit(end);
    isInitialized = true;
  };

  const end = () => {
    if (!isInitialized) return;
    if (!fleet.isAllShipsPlaced()) throw new Error('Not all ships have been placed');
    mainGrid.end();
    fleet.end();
    placementView.endTurn();
    isInitialized = false;
    emitter.publish(BOARD_PLACEMENT_EVENTS.END);
  };

  return {
    start,
    end
  };
};
