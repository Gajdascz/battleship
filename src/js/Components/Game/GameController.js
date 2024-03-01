import { GameModel } from './GameModel';
import { GameView } from './GameView';
import { initializePlayerComponents } from './utility/initializePlayerComponents';
import { GAME_MODES, PLAYERS } from '../../Utility/constants/common';
import { GameStateController } from './GameStateController';
import { globalEmitter } from '../../Events/core/globalEventEmitter';
import { AIController } from '../AI/AIController';
import { DEFAULT_FLEET } from '../Fleet/common/fleetConstants';
import { PlayerModel } from '../Player/PlayerModel';
import { GAME_EVENTS } from './common/gameEvents';
import { EventScopeManager } from '../../Events/management/EventScopeManager';

const CLASSES = {
  GAME_CONTAINER: 'game-container'
};

export const GameController = (startGameTrigger) => {
  const model = GameModel();
  const view = GameView();
  const gameStateController = GameStateController();
  const eventScopeManager = EventScopeManager();
  const gameContainer = document.querySelector(`.${CLASSES.GAME_CONTAINER}`);

  const moveToNextPlayer = () => {
    eventScopeManager.publishActiveScopeEvent(GAME_EVENTS.TURN_ENDED);
    model.moveToNextPlayer();
    eventScopeManager.setActiveScope(model.getCurrentPlayerID());
    console.log(model.getCurrentPlayerID());
    eventScopeManager.publishActiveScopeEvent(GAME_EVENTS.PLAYER_TURN);
  };

  const startPlacementState = () => {
    const handleTransition = () => {
      gameStateController.transition(); // Placement -> Progress
      moveToNextPlayer();
      startProgressState();
    };
    const handlePlacementFinalized = () => {
      if (model.isAllPlayerShipsPlaced()) handleTransition();
      else moveToNextPlayer();
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
    const handleAttackProcessed = () => {
      console.log(model.hasPlayerLost());
      if (!model.hasPlayerLost()) moveToNextPlayer();
    };
    eventScopeManager.setAllScopeDetails(GAME_EVENTS.ATTACK_PROCESSED, handleAttackProcessed);
  };

  const initializePlayer = (playerSettings, boardSettings, isAI = false) => {
    if (isAI) {
      const player = AIController({
        difficulty: playerSettings.difficulty,
        boardSettings,
        shipData: DEFAULT_FLEET
      });
      const gameModelObj = {
        id: player.getID(),
        name: player.getName(),
        isAllShipsSunk: player.isAllShipsSunk,
        isAllShipsPlaced: player.isAllShipsPlaced
      };
      model.addPlayer(gameModelObj);
      eventScopeManager.addScopeToRegistry(player.getID());
      player.initializeStateManagement();
      return player;
    }
    const playerModel = PlayerModel({
      playerName: playerSettings.username,
      playerType: playerSettings.type,
      playerID: playerSettings.id
    });
    const player = initializePlayerComponents({
      playerModel,
      boardSettings,
      gameMode: model.getGameMode(),
      shipData: DEFAULT_FLEET
    });
    player.controllers.board.set.displayContainer(gameContainer);
    const gameModelObj = {
      id: player.playerModel.getID(),
      name: player.playerModel.getName(),
      isAllShipsSunk: player.controllers.fleet.isAllShipsSunk,
      isAllShipsPlaced: player.controllers.fleet.isAllShipsPlaced
    };
    model.addPlayer(gameModelObj);
    eventScopeManager.addScopeToRegistry(player.playerModel.getID());

    return player;
  };

  const initializeHvH = (p1, p2) => {
    p1.controllers.board.view.setOpponentPlayerName(p2.playerModel.getName());
    p1.controllers.board.set.trackingFleet(p2.controllers.fleet.getTrackingFleet());
    p2.controllers.board.view.setOpponentPlayerName(p1.playerModel.getName());
    p2.controllers.board.set.trackingFleet(p1.controllers.fleet.getTrackingFleet());
  };

  const initializeHvA = (p1, p2) => {
    p1.controllers.board.view.aiView.setView(p2.getView());
  };

  const startGame = ({ data }) => {
    const { p1Settings, p2Settings, boardSettings } = data;
    const isP2AI = p2Settings.type === PLAYERS.TYPES.AI;
    const gameMode = isP2AI ? GAME_MODES.HvA : GAME_MODES.HvH;
    model.setGameMode(gameMode);
    const p1 = initializePlayer(p1Settings, boardSettings);
    const p2 = initializePlayer(p2Settings, boardSettings, isP2AI);
    model.setPlayerOrder();
    if (isP2AI) initializeHvA(p1, p2);
    else initializeHvH(p1, p2);
    gameStateController.initialize(); // None -> Start
    startPlacementState();
  };
  globalEmitter.subscribe(startGameTrigger, startGame);
};
