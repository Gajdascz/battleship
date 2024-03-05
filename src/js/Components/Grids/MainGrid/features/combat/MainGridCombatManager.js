import { MAIN_GRID_COMBAT_EVENTS } from '../../common/mainGridEvents';
import { convertToDisplayFormat } from '../../../../../Utility/utils/coordinatesUtils';
import { STATUSES } from '../../../../AI/common/constants';
import { EventEmitter } from '../../../../../Events/core/EventEmitter';

export const MainGridCombatManager = (model, view, componentEmitter) => {
  const emitter = EventEmitter();
  const acceptAttackRequest = ({ data }) => {
    const cellData = model.processIncomingAttack(data);
    const [x, y] = data;
    const displayCoordinates = convertToDisplayFormat(x, y, model.getLetterAxis());
    if (cellData.status === STATUSES.HIT) view.displayShipHit(displayCoordinates);
    emitter.publish(MAIN_GRID_COMBAT_EVENTS.ATTACK_PROCESSED, cellData);
  };

  const handleInitialize = () => {
    componentEmitter.unsubscribe(MAIN_GRID_COMBAT_EVENTS.INITIALIZE, handleInitialize);
    componentEmitter.subscribe(MAIN_GRID_COMBAT_EVENTS.END, handleEnd);

    emitter.subscribeMany(subscriptions);
  };

  const handleEnd = () => {
    emitter.reset();
    componentEmitter.unsubscribe(MAIN_GRID_COMBAT_EVENTS.END, handleEnd);
  };

  const onAttackProcessed = ({ data }) =>
    emitter.subscribe(MAIN_GRID_COMBAT_EVENTS.ATTACK_PROCESSED, data);

  const offAttackProcessed = ({ data }) =>
    emitter.unsubscribe(MAIN_GRID_COMBAT_EVENTS.ATTACK_PROCESSED, data);

  const subscriptions = [
    {
      event: MAIN_GRID_COMBAT_EVENTS.PROCESS_INCOMING_ATTACK,
      callback: acceptAttackRequest
    },
    {
      event: MAIN_GRID_COMBAT_EVENTS.SUB_ATTACK_PROCESSED,
      callback: onAttackProcessed
    },
    {
      event: MAIN_GRID_COMBAT_EVENTS.UNSUB_ATTACK_PROCESSED,
      callback: offAttackProcessed
    }
  ];

  componentEmitter.subscribe(MAIN_GRID_COMBAT_EVENTS.INITIALIZE, handleInitialize);
};
