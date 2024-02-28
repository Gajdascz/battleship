import { BoardView } from './view/BoardView';
import { BoardModel } from './model/BoardModel';
import { mapShipQuadrants } from './utility/mapShipQuadrants';
import { MAIN_GRID_EVENTS } from '../Grids/MainGrid/utility/mainGridEvents';
import { SHIP_EVENTS } from '../Ship/events/shipEvents';
import { EventManager } from '../../Events/management/EventManager';
import { GameStateController } from '../Game/GameStateController';
import { GameStateManager } from '../../State/GameStateManager';
import stateManagerRegistry from '../../State/stateManagerRegistry';
import { GAME_EVENTS } from '../Game/utility/gameEvents';
import { GAME_MODES } from '../../Utility/constants/common';
import { HvHBoardView } from './view/HvHBoardView';
import { HvABoardView } from './view/HvABoardView';

export const BoardController = ({
  playerID,
  playerName,
  fleetController,
  mainGridController,
  trackingGridController,
  gameMode,
  opponentScope
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

  const view =
    gameMode === GAME_MODES.HvH ? HvHBoardView(viewParameters) : HvABoardView(viewParameters);

  const { publisher, subscriptionManager, componentEmitter } = EventManager(model.getScope());
  const stateManager = GameStateManager(model.getScopedID());

  const quadrantMap = { current: null };

  const handlers = {
    shipSelected: ({ data }) => {
      publisher.scoped.noFulfill(MAIN_GRID_EVENTS.PLACEMENT.TOGGLE_PLACEMENT_SUBMISSION_REQUEST, {
        isReady: false
      });
      view.buttons.rotateShip.update(data.scopedID);
    },
    shipPlaced: () => {
      publisher.scoped.noFulfill(MAIN_GRID_EVENTS.PLACEMENT.TOGGLE_PLACEMENT_SUBMISSION_REQUEST, {
        isReady: model.isAllShipsPlaced()
      });
      view.buttons.rotateShip.clearWrapper();
    },
    placementsFinalized: () => {
      // map placement quadrants
      if (gameMode === GAME_MODES.HvA) view.aiView.display();
      else view.displayAlternatePlayerDialog();
      publisher.global.noFulfill(GAME_EVENTS.TURN_ENDED);
    }
  };

  const placementManager = {
    subscriptions: [
      { event: SHIP_EVENTS.PLACEMENT.SET, callback: handlers.shipPlaced },
      { event: SHIP_EVENTS.SELECTION.SELECTED, callback: handlers.shipSelected },
      { event: MAIN_GRID_EVENTS.PLACEMENT.FINALIZED, callback: handlers.placementsFinalized }
    ],
    subscribe: () => subscriptionManager.scoped.subscribeMany(placementManager.subscriptions),
    unsubscribe: () => subscriptionManager.all.unsubscribe(placementManager.subscriptions),
    initialize: () => {
      view.buttons.submitPlacements.init();
      view.trackingGrid.disable();
      view.trackingGrid.hide();
      placementManager.subscribe();
    },
    end: () => {
      view.trackingGrid.show();
      view.trackingGrid.enable();
      placementManager.unsubscribe();
    }
  };

  const combatHvHStrategy = {};

  const combatManager = {
    subscriptions: [{ event: GAME_EVENTS.ATTACK_SENT }],
    initialize: () => {
      view.buttons.endTurn.init();
    }
  };

  stateManager.setFunctions.placement(placementManager.initialize, placementManager.end);

  return {
    getBoardElement: () => view.getBoardElement(),
    setTrackingFleet: (opponentTrackingFleet) => view.setTrackingFleet(opponentTrackingFleet),
    isAllShipsPlaced: () => model.isAllShipsPlaced(),
    getView: () => view,
    initializeStateManagement: () => stateManagerRegistry.registerManager(stateManager),
    view
  };
};
