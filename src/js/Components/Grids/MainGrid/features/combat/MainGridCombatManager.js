import { MAIN_GRID_COMBAT_EVENTS } from '../../common/mainGridEvents';
import { convertToDisplayFormat } from '../../../../../Utility/utils/coordinatesUtils';
import { STATUSES } from '../../../../AI/common/constants';
import { ManagerFactory } from '../../../../../Utility/ManagerFactory';

const MainGridCombatManager = ({ model, view, createHandler }) => {
  const incomingAttack = {
    handler: null,
    process: ({ data }) => {
      const cellData = model.processIncomingAttack(data);
      const [x, y] = data;
      const displayCoordinates = convertToDisplayFormat(x, y, model.getLetterAxis());
      if (cellData.status === STATUSES.HIT) view.displayShipHit(displayCoordinates);
      incomingAttack.handler.emit(cellData);
    },
    on: (callback) => incomingAttack.handler.on(callback),
    off: (callback) => incomingAttack.handler.off(callback),
    start: () =>
      (incomingAttack.handler = createHandler(
        MAIN_GRID_COMBAT_EVENTS.INCOMING_ATTACK_PROCESSED,
        incomingAttack.process
      )),
    end: () => incomingAttack.handler.reset()
  };

  const start = () => incomingAttack.start();
  const end = () => incomingAttack.end();

  return {
    start,
    end,
    processIncomingAttack: (coordinates) => incomingAttack.process(coordinates),
    onIncomingAttackProcessed: (callback) => incomingAttack.on(callback),
    offIncomingAttackProcessed: (callback) => incomingAttack.off(callback)
  };
};

export const CombatManagerFactory = ({ model, view, createHandler }) =>
  ManagerFactory({
    ManagerBuilder: MainGridCombatManager,
    initialDetails: { model, view, createHandler },
    validateDetails: (details) => details.model && details.view && details.createHandler
  });
