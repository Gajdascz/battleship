import { AI_COMBAT_EVENTS } from '../../common/aiEvents';
import { EventEmitter } from '../../../../Events/core/EventEmitter';
export const CombatManager = ({
  model,
  componentEmitter,
  opponentProcessIncomingAttack,
  opponentOnIncomingAttackProcessed,
  opponentOnAttackSent
}) => {
  const emitter = EventEmitter();

  const getAttackStrategy = () => model.moves.getRandomMove;
  const getAttackCoordinates = getAttackStrategy();

  const sendAttack = () => {
    const attackCoordinates = getAttackCoordinates();
    emitter.publish(AI_COMBAT_EVENTS.ATTACK_SENT, attackCoordinates);
  };
  const processIncomingAttack = ({ data }) => {
    console.log(data);
    const cell = model.mainGrid.processIncomingAttack(data);
    console.log(cell);
    emitter.publish(AI_COMBAT_EVENTS.INCOMING_ATTACK_PROCESSED, cell);
  };

  const processSentAttackResult = ({ data }) => {
    emitter.publish(AI_COMBAT_EVENTS.SENT_ATTACK_PROCESSED, data);
  };

  const handleInitialize = ({ data }) => {
    model.moves.initialize();
    emitter.subscribeMany(subscriptions);
  };

  const onAttackSent = ({ data }) => emitter.subscribe(AI_COMBAT_EVENTS.ATTACK_SENT, data);
  const offAttackSent = ({ data }) => emitter.unsubscribe(AI_COMBAT_EVENTS.ATTACK_SENT, data);

  const onIncomingAttackProcessed = ({ data }) =>
    emitter.subscribe(AI_COMBAT_EVENTS.INCOMING_ATTACK_PROCESSED, data);
  const offIncomingAttackProcessed = ({ data }) =>
    emitter.unsubscribe(AI_COMBAT_EVENTS.INCOMING_ATTACK_PROCESSED, data);

  onAttackSent(opponentProcessIncomingAttack);
  processSentAttackResult(opponentOnIncomingAttackProcessed);
  opponentOnAttackSent(processIncomingAttack);

  const subscriptions = [
    { event: AI_COMBAT_EVENTS.SEND_ATTACK, callback: sendAttack },
    { event: AI_COMBAT_EVENTS.PROCESS_SENT_ATTACK_RESULT, callback: processSentAttackResult },
    { event: AI_COMBAT_EVENTS.INCOMING_ATTACK, callback: processIncomingAttack },
    { event: AI_COMBAT_EVENTS.SUB_ATTACK_SENT, callback: onAttackSent },
    { event: AI_COMBAT_EVENTS.UNSUB_ATTACK_SENT, callback: offAttackSent },
    { event: AI_COMBAT_EVENTS.SUB_INCOMING_ATTACK_PROCESSED, callback: onIncomingAttackProcessed },
    {
      event: AI_COMBAT_EVENTS.UNSUB_INCOMING_ATTACK_PROCESSED,
      callback: offIncomingAttackProcessed
    }
  ];

  componentEmitter.subscribe(AI_COMBAT_EVENTS.INITIALIZE, handleInitialize);
};
