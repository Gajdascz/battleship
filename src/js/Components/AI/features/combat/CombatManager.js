import { AI_COMBAT_EVENTS } from '../../common/aiEvents';

export const CombatManager = ({ model, componentEmitter }) => {
  const getAttackStrategy = () => model.moves.getRandomMove;
  const getAttackCoordinates = getAttackStrategy();
  model.moves.initialize();

  const { publish } = componentEmitter;

  const sendAttack = () => {
    const attackCoordinates = getAttackCoordinates();
    publish(AI_COMBAT_EVENTS.ATTACK_SENT, attackCoordinates);
  };
  const processIncomingAttack = ({ data }) => {
    console.log(data);
    const cell = model.mainGrid.processIncomingAttack(data);
    console.log(cell);
    publish(AI_COMBAT_EVENTS.INCOMING_ATTACK_PROCESSED, cell);
  };

  const processSentAttackResult = ({ data }) => {
    publish(AI_COMBAT_EVENTS.SENT_ATTACK_PROCESSED, data);
  };

  componentEmitter.subscribe(AI_COMBAT_EVENTS.SEND_ATTACK, sendAttack);
  componentEmitter.subscribe(AI_COMBAT_EVENTS.INCOMING_ATTACK, processIncomingAttack);
};
