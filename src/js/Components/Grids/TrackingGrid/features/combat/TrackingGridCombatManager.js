// Tracking Grid Component
import { TRACKING_GRID_COMBAT_EVENTS } from '../../common/trackingGridEvents';
import { TrackingGridCombatView } from './TrackingGridCombatView';
// External
import { EventEmitter } from '../../../../../Events/core/EventEmitter';

export const TrackingGridCombatManager = (view, componentEmitter) => {
  const combatView = TrackingGridCombatView(view);
  const emitter = EventEmitter();

  const handleSendAttack = (coordinates) =>
    emitter.publish(TRACKING_GRID_COMBAT_EVENTS.ATTACK_SENT, coordinates);

  const processSentAttackResult = ({ data }) => {
    combatView.displayResult(data);
    emitter.publish(TRACKING_GRID_COMBAT_EVENTS.SENT_ATTACK_PROCESSED);
  };

  const handleEnable = () => combatView.enable();
  const handleDisable = () => combatView.disable();

  const handleEnd = () => {
    componentEmitter.unsubscribeMany(subscriptions);
    combatView.end();
    emitter.reset();
  };

  const handleInitialize = () => {
    componentEmitter.unsubscribe(TRACKING_GRID_COMBAT_EVENTS.INITIALIZE, handleInitialize);
    componentEmitter.subscribeMany(subscriptions);
    combatView.initialize(handleSendAttack);
  };

  const onAttackSent = ({ data }) =>
    emitter.subscribe(TRACKING_GRID_COMBAT_EVENTS.ATTACK_SENT, data);
  const offAttackSent = ({ data }) =>
    emitter.unsubscribe(TRACKING_GRID_COMBAT_EVENTS.ATTACK_SENT, data);

  const onSentAttackProcessed = ({ data }) =>
    emitter.subscribe(TRACKING_GRID_COMBAT_EVENTS.SENT_ATTACK_PROCESSED, data);
  const offSentAttackProcessed = ({ data }) =>
    emitter.unsubscribe(TRACKING_GRID_COMBAT_EVENTS.SENT_ATTACK_PROCESSED, data);

  const subscriptions = [
    {
      event: TRACKING_GRID_COMBAT_EVENTS.PROCESS_SENT_ATTACK_RESULT,
      callback: processSentAttackResult
    },
    { event: TRACKING_GRID_COMBAT_EVENTS.SUB_ATTACK_SENT, callback: onAttackSent },
    { event: TRACKING_GRID_COMBAT_EVENTS.UNSUB_ATTACK_SENT, callback: offAttackSent },
    {
      event: TRACKING_GRID_COMBAT_EVENTS.SUB_SENT_ATTACK_PROCESSED,
      callback: onSentAttackProcessed
    },
    { event: TRACKING_GRID_COMBAT_EVENTS.UNSUB_ATTACK_SENT, callback: offSentAttackProcessed },
    { event: TRACKING_GRID_COMBAT_EVENTS.ENABLE, callback: handleEnable },
    { event: TRACKING_GRID_COMBAT_EVENTS.DISABLE, callback: handleDisable },

    { event: TRACKING_GRID_COMBAT_EVENTS.END, callback: handleEnd }
  ];

  componentEmitter.subscribe(TRACKING_GRID_COMBAT_EVENTS.INITIALIZE, handleInitialize);
};
