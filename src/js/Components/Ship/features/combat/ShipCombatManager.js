import { STATUSES } from '../../../../Utility/constants/common';
import { BOOL } from '../../../../Utility/constants/dom/attributes';
import { SHIP_DATA_ATTRIBUTES } from '../../common/shipConstants';
import { SHIP_COMBAT_EVENTS } from '../../common/shipEvents';
import { ManagerFactory } from '../../../../Utility/ManagerFactory';

const ShipCombatManager = ({ model, view, createHandler }) => {
  const hit = () => {
    const result = model.hit();
    if (result === STATUSES.SHIP_SUNK) sink.execute();
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
    initialize: () => (sink.handler = createHandler(SHIP_COMBAT_EVENTS.SUNK)),
    end: () => sink.handler.reset()
  };

  const end = () => {
    hit.end();
    sink.end();
  };

  const initialize = () => {
    sink.initialize();
  };

  return {
    initialize,
    hit,
    isSunk: model.isSunk,
    end,
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
