import { GameModel } from './GameModel';
import { GameManager } from './utility/GameManager';
import { GameStateController } from './GameStateController';
import { globalEmitter } from '../../Events/core/globalEventEmitter';
import { GAME_EVENTS } from './common/gameEvents';
import { EventScopeManager } from '../../Events/management/EventScopeManager';
import { EventEmitter } from '../../Events/core/EventEmitter';
import { STATES } from '../../Utility/constants/common';

const EVENTS = {
  ALL_PLAYERS_INITIALIZED: 'allPlayersInitialized',
  ALL_PLACEMENTS_FINALIZED: 'allPlayerPlacementsFinalized'
};

export const GameController = () => {
  const emitter = EventEmitter();
  let manager = null;

  const startGame = (data) => {
    const { p1Settings, p2Settings, boardSettings } = data;
    manager = GameManager({ p1Settings, p2Settings, boardSettings, emitter });
    const { players } = manager;
    console.log(players);
    emitter.subscribe(EVENTS.PLAYERS_INITIALIZED, startPlacementState);
    startPlacementState();
  };

  const startPlacementState = () => {
    const { alternatePlayers } = manager;
    const { isOver, startCurrent, addOnEndToCurrent } = manager.placement;
    const onPlacementEnd = () => {
      alternatePlayers();
      if (isOver()) startProgressState();
      else executeCurrentPlayerPlacement();
    };
    const executeCurrentPlayerPlacement = () => {
      startCurrent();
      addOnEndToCurrent(onPlacementEnd);
    };

    executeCurrentPlayerPlacement();
  };

  const startProgressState = () => {
    let currentController = null;
  };

  return { startGame };
};
