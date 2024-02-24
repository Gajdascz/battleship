import { GameModel } from './GameModel';
import { GameView } from './GameView';
import eventEmitter from '../../utility/events/eventEmitter';
import { ScopedEventSwitcher } from '../../utility/events/ScopedEventSwitcher';
import { getRenderStrategy } from './utility/getRenderStrategy';
import { initializePlayerComponents } from './utility/initializePlayerComponents';
import { GAME_MODES } from '../../utility/constants/common';
import { StateController } from './StateController';
import { MAIN_GRID_EVENTS } from '../Grids/MainGrid/utility/mainGridEvents';
import { GAME_EVENTS } from './utility/events';
export const GameController = (startGameTrigger) => {
  const model = GameModel();
  const view = GameView();
  const stateController = StateController();
  const scopeSwitcher = ScopedEventSwitcher();
  const strategy = {};

  const initializePlacementState = () => {
    const handlePlacementFinalized = () => {
      model.setCurrentPlayerPlacementStatus(true);
      if (model.isAllPlayerShipsPlaced()) stateController.transition();
      else strategy.render.placementState();
    };
    strategy.render.placementState();
    scopeSwitcher.setAllScopeSubscriptions(
      [MAIN_GRID_EVENTS.PLACEMENT.FINALIZED],
      handlePlacementFinalized
    );
    scopeSwitcher.setActiveScope(model.getCurrentPlayerID());

    stateController.transition(); // transition to placement state from start state.
  };

  const initializeProgressState = () => {};

  const startGame = ({ data }) => {
    stateController.enable();
    const { p1Settings, p2Settings, boardSettings } = data;

    const p1 = initializePlayerComponents({ playerSettings: p1Settings, boardSettings });
    view.addBoardView(p1.playerModel.getID(), p1.controllers.board.getView());
    scopeSwitcher.registerScope(p1.playerModel.getID());
    model.setP1({
      id: p1.playerModel.getID(),
      playerModel: p1.playerModel,
      boardController: p1.controllers.board
    });

    const p2 = initializePlayerComponents({ playerSettings: p2Settings, boardSettings });
    if (p2.isAI) {
      model.setGameMode(GAME_MODES.HvA);
      view.setAIView(p2.getView());
      p2.placeShips();
      model.setOpponentPlayerPlacementStatus(true);
    } else {
      view.addBoardView(p2.playerModel.getID(), p2.controllers.board.getView());
      scopeSwitcher.registerScope(p2.playerModel.getID());
      model.setP2({
        id: p2.playerModel.getID(),
        playerModel: p2.playerModel,
        boardController: p2.controllers.board
      });
      model.setGameMode(GAME_MODES.HvH);
    }
    strategy.render = getRenderStrategy(model, view);
    stateController.transition(); // transition to start state from no state.

    initializePlacementState();
  };

  eventEmitter.subscribe(startGameTrigger, startGame);
};
