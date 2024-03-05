// Tracking Grid Component
import { TRACKING_GRID_COMBAT_EVENTS } from '../../common/trackingGridEvents';
import { TrackingGridCombatView } from './TrackingGridCombatView';
// External
import { convertToInternalFormat } from '../../../../../Utility/utils/coordinatesUtils';
import { EventEmitter } from '../../../../../Events/core/EventEmitter';

export const TrackingGridCombatManager = (view, componentEmitter) => {
  const combatView = TrackingGridCombatView(view);
  const emitter = EventEmitter();

  const handleSendAttack = (displayCoordinates) => {
    const coordinates = convertToInternalFormat(displayCoordinates);
    emitter.publish(TRACKING_GRID_COMBAT_EVENTS.ATTACK_SENT, coordinates);
  };

  const handleResultReceived = ({ data }) => {
    combatView.displayResult(data);
    emitter.publish(TRACKING_GRID_COMBAT_EVENTS.ATTACK_PROCESSED);
  };

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

  const onAttackProcessed = ({ data }) =>
    emitter.subscribe(TRACKING_GRID_COMBAT_EVENTS.ATTACK_PROCESSED, data);
  const offAttackProcessed = ({ data }) =>
    emitter.unsubscribe(TRACKING_GRID_COMBAT_EVENTS.ATTACK_PROCESSED, data);

  const subscriptions = [
    { event: TRACKING_GRID_COMBAT_EVENTS.PROCESS_ATTACK_RESULT, callback: handleResultReceived },
    { event: TRACKING_GRID_COMBAT_EVENTS.SUB_ATTACK_SENT, callback: onAttackSent },
    { event: TRACKING_GRID_COMBAT_EVENTS.UNSUB_ATTACK_SENT, callback: offAttackSent },
    { event: TRACKING_GRID_COMBAT_EVENTS.SUB_ATTACK_PROCESSED, callback: onAttackProcessed },
    { event: TRACKING_GRID_COMBAT_EVENTS.UNSUB_ATTACK_SENT, callback: offAttackProcessed },
    { event: TRACKING_GRID_COMBAT_EVENTS.END, callback: handleEnd }
  ];

  componentEmitter.subscribe(TRACKING_GRID_COMBAT_EVENTS.INITIALIZE, handleInitialize);
};
