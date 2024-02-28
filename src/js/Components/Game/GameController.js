import { GameModel } from './GameModel';
import { GameView } from './GameView';
import { getRenderStrategy } from './utility/getRenderStrategy';
import { initializePlayerComponents } from './utility/initializePlayerComponents';
import { GAME_MODES, PLAYERS } from '../../Utility/constants/common';
import { MAIN_GRID_EVENTS } from '../Grids/MainGrid/utility/mainGridEvents';
import { GameStateManager } from '../../State/GameStateManager';
import { GameStateController } from './GameStateController';
import { globalEmitter } from '../../Events/core/globalEventEmitter';
import { ScopedEventSwitcher } from '../../Events/management/ScopedEventSwitcher';
import { AIController } from '../AI/AIController';
import { DEFAULT_FLEET } from '../Fleet/utility/fleetConstants';
import { PlayerModel } from '../Player/PlayerModel';
import { GAME_EVENTS } from './utility/gameEvents';

export const GameController = (startGameTrigger) => {
  const model = GameModel();
  const view = GameView();
  const strategy = {};
  const gameStateController = GameStateController();
  const scopedEventSwitcher = ScopedEventSwitcher();

  const initializePlacementState = () => {
    globalEmitter.subscribe(GAME_EVENTS.TURN_ENDED, () => console.log('test'));
    const handlePlacementFinalized = () => {
      model.setCurrentPlayerPlacementStatus(true);
      if (model.isAllPlayerShipsPlaced()) gameStateController.transition();
      else strategy.render.placementState();
    };
    strategy.render.placementState();
    scopedEventSwitcher.setAllScopeSubscriptions(
      [MAIN_GRID_EVENTS.PLACEMENT.FINALIZED],
      handlePlacementFinalized
    );
    scopedEventSwitcher.setActiveScope(model.getCurrentPlayerID());

    gameStateController.transition(); // transition to placement state from start state.
  };

  const initializeProgressState = () => {};

  const startGame = ({ data }) => {
    const { p1Settings, p2Settings, boardSettings } = data;
    let p2 = null;
    const p1Model = PlayerModel({
      playerName: p1Settings.username,
      playerType: p1Settings.type,
      playerID: p1Settings.id
    });
    if (p2Settings.type === PLAYERS.TYPES.AI) {
      p2 = AIController({
        difficulty: p2Settings.difficulty,
        boardSettings,
        shipData: DEFAULT_FLEET
      });
      model.setGameMode(GAME_MODES.HvA);
    } else {
      p2 = PlayerModel({
        playerName: p2Settings.username,
        playerType: p2Settings.type,
        playerID: p2Settings.id
      });
      model.setGameMode(GAME_MODES.HvH);
    }
    console.log(p1Model);
    const p1 = initializePlayerComponents({
      playerModel: p1Model,
      boardSettings,
      gameMode: model.getGameMode(),
      opponentScope: p2.getID()
    });
    console.log(p1);
    view.addBoardView(p1Model.getID(), p1.controllers.board.getView());
    scopedEventSwitcher.registerScope(p1Model.getID());
    model.setP1({
      id: p1Model.getID(),
      playerModel: p1Model,
      boardController: p1.controllers.board
    });
    if (p2.isAI) {
      p2.placeShips();
      model.setOpponentPlayerPlacementStatus(true);
      p1.controllers.board.view.aiView.setView(p2.getView());
    } else {
      p2 = initializePlayerComponents({
        playerModel: p2,
        boardSettings,
        gameMode: model.getGameMode(),
        opponentScope: p1Model.getID()
      });
      view.addBoardView(p2.playerModel.getID(), p2.controllers.board.getView());
      scopedEventSwitcher.registerScope(p2.playerModel.getID());
      model.setP2({
        id: p2.playerModel.getID(),
        playerModel: p2.playerModel,
        boardController: p2.controllers.board
      });
      model.setGameMode(GAME_MODES.HvH);
      p1.controllers.board.view.setOpponentPlayerName(p2.playerModel.getName());
    }
    strategy.render = getRenderStrategy(model, view);
    gameStateController.initialize();

    initializePlacementState();
  };
  globalEmitter.subscribe(startGameTrigger, startGame);
};
