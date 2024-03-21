/**
 * Initializes a turn manager for two-player games, orchestrating turn-based events and actions.
 *
 * @param {Object} params Configuration parameters including event handlers and player IDs.
 * @param {Function} params.emit Function to emit events.
 * @param {Function} params.on Function to subscribe to events.
 * @param {Function} params.off Function to unsubscribe from events.
 * @param {Object} params.events Contains event names for starting and ending turns.
 * @param {string} params.p1Id Player one's identifier.
 * @param {string} params.p2Id Player two's identifier.
 * @returns {Object} Provides methods for turn management and interaction.
 */
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
  /**
   * Swaps the current and waiting players.
   */
  const swapCurrent = () =>
    ([players.current, players.waiting] = [players.waiting, players.current]);
  const getCurrentPlayer = () => players.current;
  const startCurrentPlayerTurn = () => emit(getEvent[players.current].START);
  const endCurrentPlayerTurn = () => emit(getEvent[players.current].END);

  /**
   * Generates methods to end turns for all players.
   *
   * @returns {Object} Mapping of player IDs to their end turn methods.
   */
  const getAllPlayerEndTurnMethods = () =>
    Object.fromEntries(
      Object.entries(getEvent).map(([key, value]) => [key, () => emit(value.END)])
    );

  /**
   * Alternates the turn to the next player and starts their turn.
   */
  const alternate = () => {
    swapCurrent();
    startCurrentPlayerTurn();
  };

  /**
   * Enables or disables automatic turn alternation following turn end events.
   */
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

  /**
   * Creates a manager to set or unset callbacks for turn start events for a given player.
   *
   * @param {string} id The player's ID to manage turn start events.
   * @returns {Object} Methods to set and unset turn start event callbacks.
   */
  const OnTurnStartManager = (id) => {
    let onStart = null;
    const getStartEvent = () => getEvent[id].START;
    const set = (callback) => {
      if (onStart) off(getStartEvent(), onStart);
      on(getStartEvent(), callback);
      onStart = callback;
    };
    const remove = () => {
      if (!onStart) return;
      off(getStartEvent(), onStart);
      onStart = null;
    };
    return { set, remove };
  };
  const onTurnStartManagers = {
    [p1Id]: OnTurnStartManager(p1Id),
    [p2Id]: OnTurnStartManager(p2Id)
  };

  /**
   * Creates a manager to set or unset callbacks for turn end events for a given player.
   *
   * @param {string} id The player's ID to manage turn end events.
   * @returns {Object} Methods to set and unset turn end event callbacks.
   */
  const OnTurnEndManager = (id) => {
    let onEnd = null;
    const getEndEvent = () => getEvent[id].END;
    const set = (callback) => {
      if (onEnd) off(getEndEvent(), onEnd);
      on(getEndEvent(), callback);
      onEnd = callback;
    };
    const remove = () => {
      if (!onEnd) return;
      off(getEndEvent(), onEnd);
      onEnd = null;
    };
    return { set, remove };
  };
  const onTurnEndManagers = {
    [p1Id]: OnTurnEndManager(p1Id),
    [p2Id]: OnTurnEndManager(p2Id)
  };

  /**
   * Resets the turn manager to its initial state, disabling auto-alternation and clearing callbacks.
   */
  const reset = () => {
    players.current = p1Id;
    players.waiting = p2Id;
    autoAlternate.disable();
    Object.values(onTurnStartManagers).forEach((manager) => manager.remove());
    Object.values(onTurnStartManagers).forEach((manager) => manager.remove());
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
