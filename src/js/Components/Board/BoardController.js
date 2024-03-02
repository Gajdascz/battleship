// Board Component
import { BoardModel } from './main/model/BoardModel';
import { HvHBoardView } from './main/view/HvHBoardView';
import { HvABoardView } from './main/view/HvABoardView';
import { BoardPlacementManager } from './features/placement/BoardPlacementManager';
import { BoardCombatManager } from './features/combat/BoardCombatManager';

// External
import { EventManager } from '../../Events/management/EventManager';
import { GameStateManager } from '../../State/GameStateManager';
import { GAME_MODES, STATES } from '../../Utility/constants/common';
import stateManagerRegistry from '../../State/stateManagerRegistry';
import { GAME_EVENTS } from '../Game/common/gameEvents';

export const BoardController = ({
  playerID,
  playerName,
  fleetController,
  mainGridController,
  trackingGridController,
  gameMode
}) => {
  const controllers = {
    fleet: fleetController,
    mainGrid: mainGridController,
    trackingGrid: trackingGridController
  };
  const model = BoardModel(playerID, {
    mainGridModel: controllers.mainGrid.getModel(),
    trackingGridModel: controllers.trackingGrid.getModel(),
    fleetModel: controllers.fleet.getModel()
  });
  const viewParameters = {
    scopedID: model.getScopedID(),
    playerName,
    mainGridView: controllers.mainGrid.getView(),
    trackingGridView: controllers.trackingGrid.getView(),
    fleetView: controllers.fleet.getView()
  };
  const current = { state: null };

  const placement = () => {
    controllers.fleet.placement.setFleetPlacementContainer(controllers.mainGrid.getGridElement());
    controllers.mainGrid.placement.initialize();
    controllers.fleet.placement.subscribeSelect(controllers.mainGrid.placement.updatePreviewEntity);
    controllers.fleet.placement.subscribeOrientationToggled(
      controllers.mainGrid.placement.updatePreviewOrientation
    );
    view.display();
  };
  const view =
    gameMode === GAME_MODES.HvH ? HvHBoardView(viewParameters) : HvABoardView(viewParameters);

  const { publisher, subscriptionManager, scopeManager } = EventManager(model.getScope());
  const stateManager = GameStateManager(model.getScopedID());

  const placementManager = BoardPlacementManager({ view, model, publisher, subscriptionManager });
  const combatManager = BoardCombatManager({ view, publisher, subscriptionManager, scopeManager });

  const initializePlacement = () => {
    current.state = STATES.PLACEMENT;
    placementManager.initialize();
  };
  const initializeCombat = () => {
    current.state = STATES.PROGRESS;
    combatManager.initialize(gameMode, model.getOpponentScope());
  };

  stateManager.setFunctions.placement({ enterFns: initializePlacement });
  stateManager.setFunctions.progress({
    enterFns: initializeCombat,
    exitFns: combatManager.end
  });
  placement();
  return {
    set: {
      displayContainer: (container) => view.setContainer(container),
      trackingFleet: (fleet) => view.trackingGrid.setFleet(fleet),
      opponentScope: (scope) => model.setOpponentScope(scope)
    },
    isAllShipsPlaced: () => model.isAllShipsPlaced(),
    getView: () => view,
    initializeStateManagement: () => stateManagerRegistry.registerManager(stateManager),
    view
  };
};
