import { ManagerFactory } from '../../../../Utility/ManagerFactory';
import { FLEET_PLACEMENT_EVENTS } from '../../common/fleetEvents';

const FleetPlacementManager = ({ shipPlacementManagers, createHandler, isAllShipsPlaced }) => {
  const selected = { ship: null, data: null };
  const orientation = {
    on: (callback) =>
      shipPlacementManagers.forEach((manager) => manager.onOrientationToggled(callback)),
    off: (callback) =>
      shipPlacementManagers.forEach((manager) => manager.offOrientationToggled(callback))
  };

  const select = {
    handler: null,
    getData: () => ({
      ...selected.data,
      rotateButton: selected.ship.getRotateButton()
    }),
    emitData: () => select.handler.emit(select.getData()),
    execute: ({ data }) => {
      allShipsPlaced.emitFalse();
      const { id } = data;
      shipPlacementManagers.forEach((manager, key) => {
        if (key === id) {
          manager.select();
          selected.ship = manager;
          selected.data = data;
        } else if (manager.isSelected()) manager.deselect();
      });
      select.emitData();
    },
    on: (callback) => select.handler.on(callback),
    off: (callback) => select.handler.off(callback),
    start: () => (select.handler = createHandler(FLEET_PLACEMENT_EVENTS.SELECTED)),
    end: () => select.handler.reset()
  };

  const place = ({ data }) => {
    if (!selected.ship) throw new Error('Cannot placed unselected ship.');
    selected.ship.place(data);
    selected.ship = null;
    selected.data = null;
    if (isAllShipsPlaced()) allShipsPlaced.emitTrue();
  };

  const allShipsPlaced = {
    handler: null,
    emitTrue: () => allShipsPlaced.handler.emit(true),
    emitFalse: () => allShipsPlaced.handler.emit(false),
    start: () => (allShipsPlaced.handler = createHandler(FLEET_PLACEMENT_EVENTS.ALL_SHIPS_PLACED)),
    on: (callback) => allShipsPlaced.handler.on(callback),
    off: (callback) => allShipsPlaced.handler.off(callback),
    end: () => allShipsPlaced.handler.reset()
  };

  const start = () => {
    shipPlacementManagers.forEach((manager) => {
      manager.start();
      manager.onSelected(select.execute);
    });
    select.start();
    allShipsPlaced.start();
  };

  const end = () => {
    shipPlacementManagers.forEach((manager) => manager.end());
    select.end();
    allShipsPlaced.end();
  };
  return {
    isAllShipsPlaced,
    start,
    end,
    select: () => select.execute(),
    place: (coordinates) => place(coordinates),
    onOrientationToggled: (callback) => orientation.on(callback),
    offOrientationToggled: (callback) => orientation.off(callback),
    onSelected: (callback) => select.on(callback),
    offSelected: (callback) => select.off(callback),
    onAllShipsPlaced: (callback) => allShipsPlaced.on(callback),
    offAllShipsPlaced: (callback) => allShipsPlaced.off(callback)
  };
};

export const PlacementManagerFactory = ({
  shipPlacementManagers,
  createHandler,
  isAllShipsPlaced
}) =>
  ManagerFactory({
    ManagerBuilder: FleetPlacementManager,
    initialDetails: { shipPlacementManagers, createHandler, isAllShipsPlaced },
    validateDetails: (details) =>
      details.shipPlacementManagers && details.createHandler && details.isAllShipsPlaced
  });
