export const TurnEventManager = (emitter, getEventKey) => {
  const { subscribe, publish, unsubscribe } = emitter;
  const END_TURN = 'endTurn';
  const START_TURN = 'startTurn';

  const events = {
    thisStart: getEventKey(START_TURN),
    thisEnd: getEventKey(END_TURN)
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
  const managers = [thisStart, thisEnd];
  const reset = () => managers.forEach((manager) => manager.offAll());

  return {
    events,
    thisStart,
    thisEnd,
    publishEnd: () => publish(events.thisEnd),
    publishStart: () => publish(events.thisStart),
    reset
  };
};
