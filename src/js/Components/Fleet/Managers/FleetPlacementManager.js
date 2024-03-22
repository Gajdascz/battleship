import { ManagerFactory } from '../../../Utility/ManagerFactory';
import { FLEET_PLACEMENT_EVENTS } from '../common/fleetEvents';

/**
 * Manages the placement of a fleet by coordinating individual ship placement managers.
 * Allows for the selection and placement of ships within a fleet, tracking the overall fleet placement state,
 * and emitting events related to fleet placement activities.
 *
 * @param {Object} detail Initialization detail.
 * @param {Array} detail.shipPlacementManagers Array of ShipPlacementManager instances.
 * @param {function} detail.createHandler Method for creating an EventHandler instance.
 * @param {function} detail.isAllShipsPlaced Method to determine if all ships have been placed.
 * @returns {Object} Interface providing fleet placement management capabilities.
 */
const FleetPlacementManager = ({ shipPlacementManagers, createHandler, isAllShipsPlaced }) => {
  const selected = { ship: null, data: null };
  /**
   * Encapsulates orientation toggling event communication.
   */
  const orientation = {
    on: (callback) =>
      shipPlacementManagers.forEach((manager) => manager.onOrientationToggled(callback)),
    off: (callback) =>
      shipPlacementManagers.forEach((manager) => manager.offOrientationToggled(callback))
  };

  /**
   * Encapsulates ship selection logic and event communication.
   */
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

  /**
   * Executes placement logic on the selected ship.
   *
   * @param {Object} data Placement coordinates [x,y]
   */
  const place = ({ data }) => {
    if (!selected.ship) throw new Error('Cannot placed unselected ship.');
    selected.ship.place(data);
    selected.ship = null;
    selected.data = null;
    if (isAllShipsPlaced()) allShipsPlaced.emitTrue();
  };

  /**
   * Encapsulates event communication for all ships being placed.
   */
  const allShipsPlaced = {
    handler: null,
    emitTrue: () => allShipsPlaced.handler.emit(true),
    emitFalse: () => allShipsPlaced.handler.emit(false),
    start: () => (allShipsPlaced.handler = createHandler(FLEET_PLACEMENT_EVENTS.ALL_SHIPS_PLACED)),
    on: (callback) => allShipsPlaced.handler.on(callback),
    off: (callback) => allShipsPlaced.handler.off(callback),
    end: () => allShipsPlaced.handler.reset()
  };

  /**
   * Initializes all ship's placement managers and own event handlers.
   */
  const start = () => {
    shipPlacementManagers.forEach((manager) => {
      manager.start();
      manager.onSelected(select.execute);
    });
    select.start();
    allShipsPlaced.start();
  };

  /**
   * Resets all ship's placement managers and own event handlers.
   */
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
