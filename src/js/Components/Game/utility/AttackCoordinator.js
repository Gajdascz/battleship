export const AttackCoordinator = ({
  incomingAttackHandler,
  sentAttackResultHandler,
  emitterBundle,
  enableIncomingOn,
  disableIncomingOn
}) => {
  const { emitter, getPlayerEventKey, getOpponentEventKey } = emitterBundle;
  const { publish, subscribe, unsubscribe } = emitter;
  const EVENTS = {
    SEND_ATTACK: 'sendAttack',
    INCOMING_ATTACK_PROCESSED: 'incomingAttackProcessed'
  };

  const events = {
    opponentSentAttack: getOpponentEventKey(EVENTS.SEND_ATTACK),
    opponentSentResult: getOpponentEventKey(EVENTS.INCOMING_ATTACK_PROCESSED),
    sendAttack: getPlayerEventKey(EVENTS.SEND_ATTACK),
    sendResult: getPlayerEventKey(EVENTS.INCOMING_ATTACK_PROCESSED)
  };

  const handleSentAttackResult = (result) => {
    sentAttackResultHandler(result);
    sentAttackResultListener.disable();
  };

  const incomingAttackListener = {
    manager: {
      start: () => {
        subscribe(enableIncomingOn, incomingAttackListener.enable);
        subscribe(disableIncomingOn, incomingAttackListener.disable);
      },
      stop: () => {
        unsubscribe(events.enableIncoming, incomingAttackListener.enable);
        unsubscribe(events.disableIncoming, incomingAttackListener.disable);
      }
    },
    enable: () => subscribe(events.opponentSentAttack, incomingAttackHandler),
    disable: () => unsubscribe(events.opponentSentAttack, incomingAttackHandler)
  };
  const sentAttackResultListener = {
    enable: () => subscribe(events.opponentSentResult, handleSentAttackResult),
    disable: () => unsubscribe(events.opponentSentResult, handleSentAttackResult)
  };

  const reset = () => {
    incomingAttackListener.disable();
    sentAttackResultListener.disable();
    incomingAttackListener.manager.stop();
  };

  return {
    start: () => incomingAttackListener.manager.start(),
    sendAttack: (coordinates) => {
      sentAttackResultListener.enable();
      publish(events.sendAttack, coordinates);
    },
    sendResult: (result) => publish(events.sendResult, result),
    reset
  };
};
