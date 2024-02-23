import { GameModel } from './GameModel';
import { GameView } from './GameView';
import { StateController } from '../../utility/stateManagement/StateController';
import { PLACEMENT_EVENTS, PROGRESS_EVENTS, START_EVENTS } from '../../utility/constants/events';
import eventEmitter from '../../utility/events/eventEmitter';
import { ScopedEventSwitcher } from '../../utility/stateManagement/ScopedEventSwitcher';
import { getRenderStrategy } from './utility/getRenderStrategy';
import { initializePlayerComponents } from './utility/initializePlayerComponents';
import { GAME_MODES } from '../../utility/constants/common';

export const GameController = (startGameTrigger) => {
  const model = GameModel();
  const view = GameView();
  const stateController = StateController();
  const scopeSwitcher = ScopedEventSwitcher();
  const strategy = {};

  const initializeStateController = () => {
    stateController.addSubscriptionToStart(START_EVENTS.ALL_PLAYERS_INITIALIZED, () => ''); // Transition to progress
    stateController.addSubscriptionToPlacement(PLACEMENT_EVENTS.ALL_PLACEMENTS_FINALIZED, () => ''); // Transition to progress
    stateController.addSubscriptionToProgress(PROGRESS_EVENTS.PLAYER_FLEET_SUNK, () => ''); // Transition to over
  };

  const startGame = ({ data }) => {
    stateController.enable();
    stateController.transition(); // transition to start state from no state.
    const { p1Settings, p2Settings, boardSettings } = data;

    const p1 = initializePlayerComponents({ playerSettings: p1Settings, boardSettings });
    view.addBoardView(p1.playerModel.getID(), p1.controllers.board.getView());
    scopeSwitcher.registerScope(p1.playerModel.getID());
    model.setP1({ playerModel: p1.playerModel, boardController: p1.controllers.board });

    const p2 = initializePlayerComponents({ playerSettings: p2Settings, boardSettings });
    if (p2.isAI()) {
      model.setGameMode(GAME_MODES.HvA);
    } else {
      view.addBoardView(p2.playerModel.getID(), p2.controllers.board.getView());
      scopeSwitcher.registerScope(p2.playerModel.getID());
      model.setP2({ playerModel: p2.playerModel, boardController: p2.controllers.board });
      model.setGameMode(GAME_MODES.HvH);
    }

    strategy.render = getRenderStrategy(model, view);
    scopeSwitcher.setAllScopeSubscriptions(
      [PLACEMENT_EVENTS.GRID_PLACEMENTS_FINALIZED],
      strategy.render.switchPlayers
    );
    scopeSwitcher.setActiveScope(p1.playerModel.getID());
    strategy.render.renderCurrent();
    stateController.transition(); // transition to placement state from start state.
  };

  eventEmitter.subscribe(startGameTrigger, startGame);
};
