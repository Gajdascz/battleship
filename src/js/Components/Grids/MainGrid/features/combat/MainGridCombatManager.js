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
    emitter.publish(MAIN_GRID_COMBAT_EVENTS.INCOMING_ATTACK_PROCESSED, cellData);
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

  const onIncomingAttackProcessed = ({ data }) =>
    emitter.subscribe(MAIN_GRID_COMBAT_EVENTS.INCOMING_ATTACK_PROCESSED, data);

  const offIncomingAttackProcessed = ({ data }) =>
    emitter.unsubscribe(MAIN_GRID_COMBAT_EVENTS.INCOMING_ATTACK_PROCESSED, data);

  const subscriptions = [
    {
      event: MAIN_GRID_COMBAT_EVENTS.PROCESS_INCOMING_ATTACK,
      callback: acceptAttackRequest
    },
    {
      event: MAIN_GRID_COMBAT_EVENTS.SUB_INCOMING_ATTACK_PROCESSED,
      callback: onIncomingAttackProcessed
    },
    {
      event: MAIN_GRID_COMBAT_EVENTS.UNSUB_INCOMING_ATTACK_PROCESSED,
      callback: offIncomingAttackProcessed
    }
  ];

  componentEmitter.subscribe(MAIN_GRID_COMBAT_EVENTS.INITIALIZE, handleInitialize);
};
