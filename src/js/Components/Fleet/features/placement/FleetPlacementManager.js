import { FLEET_PLACEMENT_EVENTS } from '../../common/fleetEvents';

export const FleetPlacementManager = ({ placementManagers, emitter, isAllShipsPlaced }) => {
  const selected = { ship: null };

  const start = () => {
    console.log(placementManagers);
    placementManagers.forEach((manager) => {
      console.log(manager);
      manager.start();
    });
    placementManagers.forEach((manager) => manager.onSelect(select));
  };

  const onOrientationToggle = (callback) =>
    placementManagers.forEach((manager) => manager.onOrientationToggle(callback));

  const offOrientationToggle = (callback) =>
    placementManagers.forEach((manager) => manager.offOrientationToggle(callback));

  const select = ({ data }) => {
    console.log(data);
    const { id } = data;
    placementManagers.forEach((manager, key) => {
      if (key === id) {
        data.rotateButton = manager.getRotateButton();
        manager.select();
        selected.ship = manager;
      } else if (manager.isSelected()) manager.deselect();
    });
    return data;
  };

  const selectHandler = emitter.createHandler(FLEET_PLACEMENT_EVENTS.SELECT, select);

  const setCoordinates = ({ data }) => {
    if (!selected.ship) throw new Error(`Cannot place unselected ship.`);
    selected.ship.setCoordinates(data);
    selected.ship = null;
    if (isAllShipsPlaced()) allShipsPlacedHandler.emit();
  };

  const placeHandler = emitter.createHandler(
    FLEET_PLACEMENT_EVENTS.SET_COORDINATES,
    setCoordinates
  );
  const allShipsPlacedHandler = emitter.createHandler(FLEET_PLACEMENT_EVENTS.ALL_SHIPS_PLACED);
  const end = () => {
    placementManagers.forEach((manager) => manager.end());
    selectHandler.reset();
    placeHandler.reset();
    allShipsPlacedHandler.reset();
  };
  return {
    isAllShipsPlaced,
    start,
    end,
    onOrientationToggle,
    offOrientationToggle,
    select: () => selectHandler.emit(),
    onSelect: (callback) => selectHandler.on(callback),
    offSelect: (callback) => selectHandler.off(callback),
    onAllShipsPlaced: (callback) => allShipsPlacedHandler.on(callback),
    offAllShipsPlaced: (callback) => allShipsPlacedHandler.off(callback),
    place: (coordinates) => placeHandler.emit(coordinates)
  };
};
