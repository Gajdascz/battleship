import { STATUSES } from '../../../AI/common/constants';
import { convertToDisplayFormat } from '../../../../Utility/utils/coordinatesUtils';
import { ManagerFactory } from '../../../../Utility/ManagerFactory';

const INCOMING_ATTACK_PROCESSED = 'incomingAttackProcessed';

const MainGridCombatManager = ({ model, view, createHandler }) => {
  const incomingAttack = {
    handler: null,
    process: ({ data }) => {
      const result = model.processIncomingAttack(data);
      const [x, y] = data;
      const displayCoordinates = convertToDisplayFormat(x, y, model.getLetterAxis());
      if (result.value.status === STATUSES.HIT) view.displayShipHit(displayCoordinates);
      incomingAttack.handler.emit(result);
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
