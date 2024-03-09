export const AttackCommunicator = ({
  incomingAttackHandler,
  sentAttackResultHandler,
  emitter,
  events
}) => {
  const { publish, subscribe, unsubscribe } = emitter;
  const {
    enableIncoming,
    disableIncoming,
    opponentSentAttack,
    opponentSentResult,
    sendAttack,
    sendResult
  } = events;

  const handleSentAttackResult = (result) => {
    sentAttackResultHandler(result);
    sentAttackResultListener.disable();
  };

  const incomingAttackListener = {
    manager: {
      start: () => {
        subscribe(enableIncoming, incomingAttackListener.enable);
        subscribe(disableIncoming, incomingAttackListener.disable);
      },
      stop: () => {
        unsubscribe(enableIncoming, incomingAttackListener.enable);
        unsubscribe(disableIncoming, incomingAttackListener.disable);
      }
    },
    enable: () => subscribe(opponentSentAttack, incomingAttackHandler),
    disable: () => unsubscribe(opponentSentAttack, incomingAttackHandler)
  };
  const sentAttackResultListener = {
    enable: () => subscribe(opponentSentResult, handleSentAttackResult),
    disable: () => unsubscribe(opponentSentResult, handleSentAttackResult)
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
      publish(sendAttack, coordinates);
    },
    sendResult: (result) => publish(sendResult, result),
    reset
  };
};
