export const TurnManager = (emitterBundle, endTurnEvent) => {
  const { emitter, getPlayerEventKey, getOpponentEventKey } = emitterBundle;
  const { subscribe, unsubscribe, publish } = emitter;

  let onTurnStart = [];
  let onTurnEnd = [];

  const addOnTurnStart = (callback) => onTurnStart.push(callback);
  const addOnTurnEnd = (callback) => onTurnEnd.push(callback);
  const removeOnTurnStart = (callback) =>
    (onTurnStart = onTurnStart.filter((fn) => fn !== callback));
  const removeOnTurnEnd = (callback) => (onTurnEnd = onTurnEnd.filter((fn) => fn !== callback));

  const executeOnStart = () => onTurnStart.forEach((fn) => fn());
  const executeOnEnd = () => onTurnEnd.forEach((fn) => fn());

  const startTurn = () => {
    if (onTurnStart.length > 0) executeOnStart();
    unsubscribe(getOpponentEventKey(endTurnEvent), startTurn);
  };
  const endTurn = () => {
    if (onTurnEnd.length > 0) executeOnEnd();
    subscribe(getOpponentEventKey(endTurnEvent), startTurn);
    publish(getPlayerEventKey(endTurnEvent));
  };

  const reset = () => {
    unsubscribe(getOpponentEventKey(endTurnEvent), startTurn);
    onTurnStart = [];
    onTurnEnd = [];
  };
  subscribe(getOpponentEventKey(endTurnEvent), startTurn);
  return {
    startTurn,
    endTurn,
    addOnTurnStart,
    addOnTurnEnd,
    removeOnTurnStart,
    removeOnTurnEnd,
    reset
  };
};
