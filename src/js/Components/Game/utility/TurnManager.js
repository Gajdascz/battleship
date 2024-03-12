export const TurnManager = (emitterBundle) => {
  const { emitter, getPlayerEventKey, getOpponentEventKey } = emitterBundle;
  const { subscribe, publish, unsubscribe } = emitter;
  const END_TURN = 'endTurn';
  const START_TURN = 'startTurn';

  const events = {
    thisStart: getPlayerEventKey(START_TURN),
    thisEnd: getPlayerEventKey(END_TURN),
    otherStart: getOpponentEventKey(START_TURN),
    otherEnd: getOpponentEventKey(END_TURN)
  };

  const EventManager = (event) => {
    let callbacks = [];
    const on = (callback) => {
      callbacks.push(callback);
      subscribe(event, callback);
    };
    const off = (callback) => {
      callbacks = callbacks.filter((fn) => fn !== callback);
      unsubscribe(event, callback);
    };
    const offAll = () => {
      callbacks.forEach((fn) => unsubscribe(event, fn));
      callbacks = [];
    };
    return {
      on,
      off,
      offAll
    };
  };
  const thisStart = EventManager(events.thisStart);
  const thisEnd = EventManager(events.thisEnd);
  const otherStart = EventManager(events.otherStart);
  const otherEnd = EventManager(events.otherEnd);
  const managers = [thisStart, thisEnd, otherStart, otherEnd];
  const reset = () => managers.forEach((manager) => manager.offAll());

  return {
    events,
    thisStart,
    thisEnd,
    otherStart,
    otherEnd,
    publishEnd: () => publish(events.thisEnd),
    publishStart: () => publish(events.thisStart),
    reset
  };
};
