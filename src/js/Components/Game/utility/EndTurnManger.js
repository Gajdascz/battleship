export const EndTurnManager = (emitterBundle) => {
  const { emitter, getPlayerEventKey, getOpponentEventKey } = emitterBundle;
  const { subscribe, publish, unsubscribe } = emitter;
  const END_TURN = 'endTurn';
  const thisTurnEnded = getPlayerEventKey(END_TURN);
  const otherTurnEnded = getOpponentEventKey(END_TURN);
  let onThisEnd = null;
  let onOtherEnd = null;
  const setOnThisEnd = (callback) => {
    if (onThisEnd) unsubscribe(thisTurnEnded, onThisEnd);
    subscribe(thisTurnEnded, callback);
    onThisEnd = callback;
  };
  const removeOnThisEnd = () => {
    if (!onThisEnd) return;
    unsubscribe(thisTurnEnded, onThisEnd);
    onThisEnd = null;
  };
  const setOnOtherEnd = (callback) => {
    if (onOtherEnd) unsubscribe(otherTurnEnded, onOtherEnd);
    subscribe(otherTurnEnded, callback);
    onOtherEnd = callback;
  };

  const removeOnOtherEnd = () => {
    if (!onOtherEnd) return;
    unsubscribe(otherTurnEnded, onOtherEnd);
    onOtherEnd = null;
  };
  const reset = () => {
    if (onThisEnd) removeOnThisEnd();
    if (onOtherEnd) removeOnOtherEnd();
    onThisEnd = null;
    onOtherEnd = null;
  };
  return {
    events: {
      thisTurnEnded,
      otherTurnEnded
    },
    publish: () => publish(thisTurnEnded),
    setOnThisEnd,
    setOnOtherEnd,
    removeOnThisEnd,
    removeOnOtherEnd,
    reset
  };
};
