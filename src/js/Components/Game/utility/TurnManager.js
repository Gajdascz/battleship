export const TurnManager = ({ emit, on, off, events, p1Id, p2Id }) => {
  const { p1StartTurn, p1EndTurn, p2StartTurn, p2EndTurn } = events;

  console.log(events, p1Id, p2Id);
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
  const alternatePlayers = () =>
    ([players.current, players.waiting] = [players.waiting, players.current]);
  const getCurrentPlayer = () => players.current;
  const startCurrentPlayerTurn = () => emit(getEvent[players.current].START);
  const endCurrentPlayerTurn = () => emit(getEvent[players.current].END);

  const switchTurns = () => {
    endCurrentPlayerTurn();
    alternatePlayers();
    startCurrentPlayerTurn();
  };
  const autoAlternate = {
    isActive: false,
    enable: () => {
      if (autoAlternate.isActive) return;
      on(getEvent[p1Id].END, switchTurns);
      on(getEvent[p2Id].END, switchTurns);
      autoAlternate.isActive = true;
    },
    disable: () => {
      if (!autoAlternate.isActive) return;
      off(getEvent[p1Id].END, switchTurns);
      off(getEvent[p2Id].END, switchTurns);
      autoAlternate.isActive = false;
    }
  };
  const onTurnEnd = {
    active: [],
    addOn: (callback) => {
      on(getEvent[p1Id].END, callback);
      on(getEvent[p2Id].END, callback);
      onTurnEnd.active.push(callback);
    },
    off: (callback) => {
      off(getEvent[p1Id].END, callback);
      off(getEvent[p2Id].END, callback);
      onTurnEnd.active = onTurnEnd.active.filter((fn) => fn !== callback);
    },
    offAll: () => {
      onTurnEnd.active.forEach((callback) => {
        off(getEvent[p1Id].END, callback);
        off(getEvent[p2Id].END, callback);
      });
      onTurnEnd.active = [];
    }
  };
  const reset = () => {
    players.current = p1Id;
    players.waiting = p2Id;
    onTurnEnd.offAll();
    autoAlternate.disable();
  };
  return {
    turnEnd: {
      on: onTurnEnd.addOn,
      off: onTurnEnd.off,
      offAll: onTurnEnd.offAll
    },
    autoAlternate: {
      enable: autoAlternate.enable,
      disable: autoAlternate.disable
    },
    switchTurns,
    alternatePlayers,
    getCurrentPlayer,
    startCurrentPlayerTurn,
    endCurrentPlayerTurn,
    reset
  };
};
