import { GameModel } from './GameModel';
import { GameView } from './GameView';
import { getRenderStrategy } from './utility/getRenderStrategy';
import { initializePlayerComponents } from './utility/initializePlayerComponents';
import { GAME_MODES } from '../../Utility/constants/common';
import { MAIN_GRID_EVENTS } from '../Grids/MainGrid/utility/mainGridEvents';
import { GameStateManager } from '../../State/GameStateManager';
import { GameStateController } from './GameStateController';
import { globalEmitter } from '../../Events/core/globalEventEmitter';
import { ScopedEventSwitcher } from '../../Events/management/ScopedEventSwitcher';

export const GameController = (startGameTrigger) => {
  const model = GameModel();
  const view = GameView();
  const strategy = {};
  const gameStateController = GameStateController();
  const scopedEventSwitcher = ScopedEventSwitcher();

  const initializePlacementState = () => {
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

    const p1 = initializePlayerComponents({
      playerSettings: p1Settings,
      boardSettings
    });
    console.log(p1);
    view.addBoardView(p1.playerModel.getID(), p1.controllers.board.getView());
    scopedEventSwitcher.registerScope(p1.playerModel.getID());
    model.setP1({
      id: p1.playerModel.getID(),
      playerModel: p1.playerModel,
      boardController: p1.controllers.board
    });

    const p2 = initializePlayerComponents({
      playerSettings: p2Settings,
      boardSettings
    });
    if (p2.isAI) {
      model.setGameMode(GAME_MODES.HvA);
      console.log(p1.controllers.board.aiView.setView(p2.getView()));
      p1.controllers.board.aiView.setView(p2.getView());
      p2.placeShips();
      model.setOpponentPlayerPlacementStatus(true);
    } else {
      view.addBoardView(p2.playerModel.getID(), p2.controllers.board.getView());
      scopedEventSwitcher.registerScope(p2.playerModel.getID());
      model.setP2({
        id: p2.playerModel.getID(),
        playerModel: p2.playerModel,
        boardController: p2.controllers.board
      });
      model.setGameMode(GAME_MODES.HvH);
    }
    strategy.render = getRenderStrategy(model, view);
    gameStateController.initialize();

    initializePlacementState();
  };
  globalEmitter.subscribe(startGameTrigger, startGame);
};
