import { STATUSES } from '../../../Utility/constants/common';
import { BOOL } from '../../../Utility/constants/dom/attributes';
import { SHIP_DATA_ATTRIBUTES } from '../common/shipConstants';
import { ManagerFactory } from '../../../Utility/ManagerFactory';

const SHIP_COMBAT_EVENTS = {
  SUNK: 'shipSunk',
  HIT: 'shipHit'
};

/**
 * Handles event-driven combat communications for a ship, managing hits and sink events.
 *
 * @param {Object} detail Initialization detail.
 * @param {Object} detail.model Ship data model.
 * @param {Object} detail.view Ship view interface.
 * @param {function} detail.createHandler Method for creating an EventHandler instance.
 * @returns {Object} Interface providing ship combat functionality.
 */
const ShipCombatManager = ({ model, view, createHandler }) => {
  /**
   * Encapsulates all hit related logic and event communication.
   */
  const hit = {
    handler: null,
    getData: () => ({
      id: model.id,
      isSunk: model.isSunk()
    }),
    emitData: () => hit.handler.emit(hit.getData()),
    execute: () => {
      const result = model.hit();
      if (result === STATUSES.SHIP_SUNK) sink.execute();
      hit.emitData();
    },
    on: (callback) => hit.handler.on(callback),
    off: (callback) => hit.handler.off(callback),
    init: () => (hit.handler = createHandler(SHIP_COMBAT_EVENTS.HIT)),
    reset: () => hit.handler.reset()
  };

  /**
   * Encapsulates all ship sinking related logic and event communication.
   */
  const sink = {
    handler: null,
    execute: () => {
      view.elements.getMainShip().setAttribute(SHIP_DATA_ATTRIBUTES.SHIP_SUNK, BOOL.T);
      view.elements.getTrackingShip().setAttribute(SHIP_DATA_ATTRIBUTES.SHIP_SUNK, BOOL.T);
      sink.handler.emit(model.id);
    },
    on: (callback) => sink.handler.on(callback),
    off: (callback) => sink.handler.off(callback),
    init: () => (sink.handler = createHandler(SHIP_COMBAT_EVENTS.SUNK)),
    reset: () => sink.handler.reset()
  };

  /**
   * Resets ship combat event handlers.
   */
  const end = () => {
    hit.reset();
    sink.reset();
  };

  /**
   * Initializes ship combat event handlers.
   */
  const start = () => {
    hit.init();
    sink.init();
  };

  return {
    start,
    end,
    hit: hit.execute,
    onHit: (callback) => hit.on(callback),
    offHit: (callback) => hit.off(callback),
    onSunk: (callback) => sink.on(callback),
    offSunk: (callback) => sink.off(callback)
  };
};

export const CombatManagerFactory = ({ model, view, createHandler }) =>
  ManagerFactory({
    ManagerBuilder: ShipCombatManager,
    initialDetails: { model, view, createHandler },
    validateDetails: (details) => details.model && details.view && details.createHandler
  });
