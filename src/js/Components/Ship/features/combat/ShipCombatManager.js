import { STATUSES } from '../../../../Utility/constants/common';
import { BOOL } from '../../../../Utility/constants/dom/attributes';
import { SHIP_DATA_ATTRIBUTES } from '../../common/shipConstants';
import { SHIP_COMBAT_EVENTS } from '../../common/shipEvents';
import { ManagerFactory } from '../../../../Utility/ManagerFactory';

const ShipCombatManager = ({ model, view, createHandler }) => {
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

  const end = () => {
    hit.reset();
    sink.reset();
  };

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
