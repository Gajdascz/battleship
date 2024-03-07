import { convertToInternalFormat } from '../../../../Utility/utils/coordinatesUtils';
import { BOARD_COMBAT_EVENTS } from '../../common/boardEvents';
export const BoardCombatManager = ({ combatView, combatControllers, componentEmitter }) => {
  const { trackingGrid, mainGrid, fleet } = combatControllers;

  mainGrid.initialize();
  trackingGrid.initialize();
  // fleet.initialize();

  const startTurn = () => {
    trackingGrid.enable();
    combatView.startTurn();
  };

  const endTurn = () => {
    trackingGrid.disable();
    combatView.endTurn();
  };

  const handleSentAttack = ({ data }) => {
    const coordinates = convertToInternalFormat(data);
    componentEmitter.publish(BOARD_COMBAT_EVENTS.ATTACK_SENT, coordinates);
  };
  trackingGrid.onAttackSent(handleSentAttack);

  const handleIncomingAttack = ({ data }) => mainGrid.processIncomingAttack(data);
  const sendIncomingAttackResult = ({ data }) =>
    componentEmitter.publish(BOARD_COMBAT_EVENTS.INCOMING_ATTACK_PROCESSED, data);

  mainGrid.onIncomingAttackProcessed(sendIncomingAttackResult);

  const handleSentAttackResult = ({ data }) => trackingGrid.processSentAttackResult(data);

  componentEmitter.subscribe(BOARD_COMBAT_EVENTS.INCOMING_ATTACK, handleIncomingAttack);
  componentEmitter.subscribe(BOARD_COMBAT_EVENTS.SENT_ATTACK_PROCESSED, handleSentAttackResult);
  componentEmitter.subscribe(BOARD_COMBAT_EVENTS.START, startTurn);
};
