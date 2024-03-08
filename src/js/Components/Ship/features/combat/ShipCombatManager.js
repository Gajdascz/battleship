import { STATUSES } from '../../../../Utility/constants/common';
import { BOOL } from '../../../../Utility/constants/dom/attributes';
import { SHIP_DATA_ATTRIBUTES } from '../../common/shipConstants';
import { SHIP_COMBAT_EVENTS } from '../../common/shipEvents';
import { ManagerFactory } from '../../../../Utility/ManagerFactory';

const ShipCombatManager = ({ model, view, createHandler }) => {
  const hit = {
    handler: null,
    execute: () => {
      const result = model.hit();
      if (result === STATUSES.SHIP_SUNK) sink.execute();
      else hit.handler.emit(model.getId());
    },
    on: (callback) => hit.handler.on(callback),
    off: (callback) => hit.handler.off(callback),
    start: () => (hit.handler = createHandler(SHIP_COMBAT_EVENTS.HIT)),
    end: () => hit.handler.reset()
  };

  const sink = {
    handler: null,
    execute: () => {
      view.elements.getMainShip().dataset[SHIP_DATA_ATTRIBUTES.SHIP_SUNK] = BOOL.T;
      view.elements.getTrackingShip().dataset[SHIP_DATA_ATTRIBUTES.SHIP_SUNK] = BOOL.T;
      sink.handler.emit(model.getId());
    },

    on: (callback) => sink.handler.on(callback),
    off: (callback) => sink.handler.off(callback),
    start: () => (sink.handler = createHandler(SHIP_COMBAT_EVENTS.SUNK)),
    end: () => sink.handler.reset()
  };

  const end = () => {
    hit.end();
    sink.end();
  };

  return {
    hit: () => hit.execute(),
    end,
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
