export const TurnManager = ({ emit, on, off, events, p1Id, p2Id }) => {
  const { p1StartTurn, p1EndTurn, p2StartTurn, p2EndTurn } = events;

  const getEvent = {
    [p1Id]: {
      START: p1StartTurn,
      END: p1EndTurn
    },
    [p2Id]: {
      START: p2StartTurn,
      END: p2EndTurn
    }
  };
  const players = { current: p1Id, waiting: p2Id };
  const swapCurrent = () =>
    ([players.current, players.waiting] = [players.waiting, players.current]);
  const getCurrentPlayer = () => players.current;
  const startCurrentPlayerTurn = () => emit(getEvent[players.current].START);
  const endCurrentPlayerTurn = () => emit(getEvent[players.current].END);
  const getAllPlayerEndTurnMethods = () =>
    Object.fromEntries(
      Object.entries(getEvent).map(([key, value]) => [key, () => emit(value.END)])
    );

  const alternate = () => {
    swapCurrent();
    startCurrentPlayerTurn();
  };
  const autoAlternate = (() => {
    let isActive = false;
    return {
      enable: () => {
        if (isActive) return;
        on(getEvent[p1Id].END, alternate);
        on(getEvent[p2Id].END, alternate);
        isActive = true;
      },
      disable: () => {
        if (isActive) return;
        off(getEvent[p1Id].END, alternate);
        off(getEvent[p2Id].END, alternate);
        isActive = false;
      }
    };
  })();
  const OnTurnStartManager = (id) => {
    let onStart = null;
    const getStartEvent = () => getEvent[id].START;
    const set = (callback) => {
      if (onStart) off(getStartEvent(id), onStart);
      on(getStartEvent(), callback);
      onStart = callback;
    };
    const off = () => {
      if (!onStart) return;
      off(getStartEvent(), onStart);
      onStart = null;
    };
    return { set, off };
  };
  const onTurnStartManagers = {
    [p1Id]: OnTurnStartManager(p1Id),
    [p2Id]: OnTurnStartManager(p2Id)
  };
  const OnTurnEndManager = (id) => {
    let onEnd = null;
    const getEndEvent = () => getEvent[id].END;
    const set = (callback) => {
      if (onEnd) off(getEndEvent(id), onEnd);
      on(getEndEvent(), callback);
      onEnd = callback;
    };
    const off = () => {
      if (!onEnd) return;
      off(getEndEvent(), onEnd);
      onEnd = null;
    };
    return { set, off };
  };
  const onTurnEndManagers = {
    [p1Id]: OnTurnEndManager(p1Id),
    [p2Id]: OnTurnEndManager(p2Id)
  };

  const reset = () => {
    players.current = p1Id;
    players.waiting = p2Id;
    autoAlternate.disable();
    Object.values(onTurnStartManagers).forEach((manager) => manager.off());
  };
  return {
    autoAlternate: {
      enable: autoAlternate.enable,
      disable: autoAlternate.disable
    },
    currentPlayer: {
      getId: getCurrentPlayer,
      startTurn: startCurrentPlayerTurn,
      endTurn: endCurrentPlayerTurn
    },
    allPlayers: {
      getAllPlayerEndTurnMethods,
      onTurnStartManagers,
      onTurnEndManagers
    },
    alternate,
    reset
  };
};
