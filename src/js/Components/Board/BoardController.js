// Board Component
import { BoardModel } from './main/model/BoardModel';
// import { HvHBoardView } from './main/view/HvHBoardView';
// import { HvABoardView } from './main/view/HvABoardView';
// import { BoardPlacementManager } from './features/placement/BoardPlacementManager';
import { BoardCombatManager } from './features/combat/BoardCombatManager';

// External
import { EventManager } from '../../Events/management/EventManager';
import { GameStateManager } from '../../State/GameStateManager';
import { GAME_MODES, STATES } from '../../Utility/constants/common';
import stateManagerRegistry from '../../State/stateManagerRegistry';
import { GAME_EVENTS } from '../Game/common/gameEvents';
import { BoardView } from './main/view/BoardView';
import { buildBoardConfig } from './boardConfiguration';

export const BoardController = ({
  playerID,
  playerName,
  fleetController,
  mainGridController,
  trackingGridController,
  gameMode,
  displayContainer
}) => {
  const controllers = {
    fleet: fleetController,
    mainGrid: mainGridController,
    trackingGrid: trackingGridController
  };
  // const model = BoardModel(playerID, {
  //   mainGridModel: controllers.mainGrid.getModel(),
  //   trackingGridModel: controllers.trackingGrid.getModel(),
  //   fleetModel: controllers.fleet.getModel()
  // });
  const viewParameters = {
    scopedID: playerID,
    playerName,
    container: displayContainer
  };
  const current = { state: null };

  const view = BoardView(viewParameters);
  const buttonManager = { current: null };
  const start = () => {
    buttonManager.current = buildBoardConfig({
      view,
      mainGrid: controllers.mainGrid,
      trackingGrid: controllers.trackingGrid,
      fleet: controllers.fleet
    });
    const { id, element } = controllers.mainGrid.view.getSubmitButton();
    console.log(buttonManager);
    buttonManager.current.addButton(id, element);
    view.display();
  };

  const setupPlacementButtons = () => {};

  const placement = () => {
    const { fleet, mainGrid } = controllers;
    mainGrid.placement.initialize();
    fleet.placement.initialize();
    fleet.placement.onSelected(mainGrid.placement.updateSelectedEntity);
    fleet.placement.onOrientationToggled(mainGrid.placement.updateOrientation);
    fleet.placement.onAllShipsPlaced(mainGrid.placement.enableSubmit);
    fleet.placement.onShipNoLongerPlaced(mainGrid.placement.disableSubmit);
    mainGrid.placement.onPlacementProcessed(fleet.placement.setCoordinates);
    start();
    // view.buttons.submitPlacements.init();
  };

  // const { publisher, subscriptionManager, scopeManager } = EventManager(model.getScope());
  // const stateManager = GameStateManager(model.getScopedID());

  // const placementManager = BoardPlacementManager({ view, model, publisher, subscriptionManager });
  // const combatManager = BoardCombatManager({ view, publisher, subscriptionManager, scopeManager });

  // const initializePlacement = () => {
  //   current.state = STATES.PLACEMENT;
  //   //   placementManager.initialize();
  // };
  // const initializeCombat = () => {
  //   current.state = STATES.PROGRESS;
  //   combatManager.initialize(gameMode, model.getOpponentScope());
  // };

  // stateManager.setFunctions.placement({ enterFns: initializePlacement });
  // stateManager.setFunctions.progress({
  //   enterFns: initializeCombat,
  //   exitFns: combatManager.end
  // });
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
