import { GameModel } from './GameModel';
import { GameManager } from './utility/GameManager';
import { GameStateController } from './GameStateController';
import { globalEmitter } from '../../Events/core/globalEventEmitter';
import { GAME_EVENTS } from './common/gameEvents';
import { EventScopeManager } from '../../Events/management/EventScopeManager';
import { EventEmitter } from '../../Events/core/EventEmitter';
import { STATES } from '../../Utility/constants/common';

export const GameController = () => {
  let manager = null;
  const startGame = (data) => {
    const { p1Settings, p2Settings, boardSettings } = data;
    manager = GameManager({ p1Settings, p2Settings, boardSettings });
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
