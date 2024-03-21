import { STATUSES } from '../../../../Utility/constants/common';
import { convertToDisplayFormat } from '../../../../Utility/utils/coordinatesUtils';
import { ManagerFactory } from '../../../../Utility/ManagerFactory';

const INCOMING_ATTACK_PROCESSED = 'incomingAttackProcessed';

/**
 * Provides event-driven communication for the Main Grid's combat functionality.
 *
 * @param {Object} detail Contains the Main Grid's data model, view, and create handler function.
 * @returns {Object} Methods to interact with main grid's combat capabilities.
 */
const MainGridCombatManager = ({ model, view, createHandler }) => {
  /**
   * @typedef {Object} incomingAttack
   * @property {function(Object)} process Processes an incoming attack request and emits the result.
   * @property {function()} init Initializes the incoming attack event handler.
   * @property {function(callback)} on Subscribes a function to execute on the incoming attack processed event.
   * @property {function(callback)} off Unsubscribes a function from the incoming attack processed event.
   * @property {function} reset Resets the event handler.
   */
  /** @type {incomingAttack} */
  const incomingAttack = {
    handler: null,
    process: ({ data }) => {
      const { coordinates, cellValue } = model.processIncomingAttack(data);
      const [x, y] = data;
      const displayCoordinates = convertToDisplayFormat(x, y, model.getLetterAxis());
      if (cellValue.status === STATUSES.HIT) view.displayShipHit(displayCoordinates);
      incomingAttack.handler.emit({ coordinates, cellValue });
    },
    init: () => {
      if (incomingAttack.handler) return;
      incomingAttack.handler = createHandler(INCOMING_ATTACK_PROCESSED);
    },
    on: (callback) => incomingAttack.handler.on(callback),
    off: (callback) => incomingAttack.handler.off(callback),
    reset: () => incomingAttack.handler.reset()
  };
  return {
    processIncomingAttack: incomingAttack.process,
    start: incomingAttack.init,
    end: incomingAttack.reset,
    onIncomingAttackProcessed: incomingAttack.on,
    offIncomingAttackProcessed: incomingAttack.off
  };
};
export const CombatManagerFactory = ({ model, view, createHandler }) =>
  ManagerFactory({
    ManagerBuilder: MainGridCombatManager,
    initialDetails: { model, view, createHandler },
    validateDetails: (details) => details.model && details.view && details.createHandler
  });
