import { GameModel } from './GameModel';
import { GameManager } from './utility/GameManager';
import { GameStateController } from './GameStateController';
import { globalEmitter } from '../../Events/core/globalEventEmitter';
import { GAME_EVENTS } from './common/gameEvents';
import { EventScopeManager } from '../../Events/management/EventScopeManager';
import { EventEmitter } from '../../Events/core/EventEmitter';
import { STATES } from '../../Utility/constants/common';

export const GameController = () => {
  let gameManager = null;
  const startGame = (data) => {
    const { p1Settings, p2Settings, boardSettings } = data;
    gameManager = GameManager({ p1Settings, p2Settings, boardSettings });
    startPlacementState();
    startProgressState();
  };

  const startPlacementState = () => {
    const numberOfPlayers = gameManager.getNumberOfPlayers();
    const { alternatePlayers, getCurrentPlacementController } = gameManager;
    let playerPlacementsFinalized = 0;
    let currentController = null;
    const onPlacementEnd = () => {
      playerPlacementsFinalized += 1;
      currentController.offEnd(onPlacementEnd);
      alternatePlayers();
      if (playerPlacementsFinalized === numberOfPlayers) startProgressState();
      else executeCurrentPlayerPlacement();
    };
    const executeCurrentPlayerPlacement = () => {
      currentController = getCurrentPlacementController();
      currentController.onEnd(onPlacementEnd);
      currentController.startTurn();
    };
    executeCurrentPlayerPlacement();
  };

  const startProgressState = () => {
    let currentController = null;
    const { alternatePlayers, getCurrentCombatController } = gameManager;
    currentController = getCurrentCombatController();
    currentController.startTurn();
  };

  return { startGame };
};
