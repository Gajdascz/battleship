import { GameModel } from './GameModel';
import { initializeGame } from './utility/initializeGame';
import { GameStateController } from './GameStateController';
import { globalEmitter } from '../../Events/core/globalEventEmitter';
import { GAME_EVENTS } from './common/gameEvents';
import { EventScopeManager } from '../../Events/management/EventScopeManager';
import { EventEmitter } from '../../Events/core/EventEmitter';

export const GameController = (startGameTrigger) => {
  const model = GameModel();
  const gameStateController = GameStateController();
  const eventScopeManager = EventScopeManager();
  const gameEmitter = EventEmitter();

  const alternatePlayers = () => {
    eventScopeManager.publishActiveScopeEvent(GAME_EVENTS.TURN_ENDED);
    model.alternatePlayers();
    eventScopeManager.setActiveScope(model.getCurrentPlayerID());
    console.log(model.getCurrentPlayerID());
    eventScopeManager.publishActiveScopeEvent(GAME_EVENTS.PLAYER_TURN);
  };

  const startPlacementState = () => {
    const handleTransition = () => {
      gameStateController.transition(); // Placement -> Progress
      alternatePlayers();
      startProgressState();
    };
    const handlePlacementFinalized = () => {
      if (model.isAllPlayerShipsPlaced()) handleTransition();
      else alternatePlayers();
    };
    eventScopeManager.setAllScopeDetails(
      GAME_EVENTS.PLAYER_FINALIZED_PLACEMENT,
      handlePlacementFinalized
    );
    eventScopeManager.setActiveScope(model.getCurrentPlayerID());
    gameStateController.transition(); // Start -> Placement.
    eventScopeManager.publishActiveScopeEvent(GAME_EVENTS.PLAYER_TURN);
  };

  const startProgressState = () => {
    const handlePlayerRequestedEndTurn = () => {
      if (!model.hasPlayerLost()) alternatePlayers();
    };
    eventScopeManager.setAllScopeDetails(
      GAME_EVENTS.PLAYER_END_TURN_REQUESTED,
      handlePlayerRequestedEndTurn
    );
  };

  const startGame = ({ data }) => {
    const { p1Settings, p2Settings, boardSettings } = data;
    const { p1, p2 } = initializeGame({ p1Settings, p2Settings, boardSettings });
    p1.controllers.board.placement.startTurn();
  };
  globalEmitter.subscribe(startGameTrigger, startGame);
};
