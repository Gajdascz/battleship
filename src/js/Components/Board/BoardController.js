import { BoardModel } from './model/BoardModel';
import { MAIN_GRID_EVENTS } from '../Grids/MainGrid/common/mainGridEvents';
import { SHIP_EVENTS } from '../Ship/common/shipEvents';
import { EventManager } from '../../Events/management/EventManager';
import { GameStateManager } from '../../State/GameStateManager';
import stateManagerRegistry from '../../State/stateManagerRegistry';
import { GAME_EVENTS } from '../Game/common/gameEvents';
import { GAME_MODES } from '../../Utility/constants/common';
import { HvHBoardView } from './view/HvHBoardView';
import { HvABoardView } from './view/HvABoardView';
import { TRACKING_GRID_EVENTS } from '../Grids/TrackingGrid/utility/trackingGridEvents';

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
      // const { width, height } = mainGridController.getDimensions();
      // quadrantMap.current = mapShipQuadrants(
      //   mainGridController.getEntityPlacements(),
      //   width,
      //   height
      // );
      // console.log(quadrantMap.current);
      view.placement.end();
      placementManager.unsubscribe();
      publisher.scoped.noFulfill(GAME_EVENTS.TURN_ENDED);
    },
    attackSent: ({ data }) => {
      const { internal, display } = data;
      subscriptionManager.scoped.subscribe(
        MAIN_GRID_EVENTS.COMBAT.INCOMING_ATTACK_PROCESSED,
        handlers.attackProcessed
      );
      publisher.scoped.noFulfill(MAIN_GRID_EVENTS.COMBAT.INCOMING_ATTACK_REQUESTED, {
        coordinates: internal
      });
    },
    attackProcessed: ({ data }) => {
      const { result } = data;
      subscriptionManager.scoped.unsubscribe(
        MAIN_GRID_EVENTS.COMBAT.INCOMING_ATTACK_REQUESTED,
        handlers.attackProcessed
      );
      publisher.scoped.noFulfill(TRACKING_GRID_EVENTS.ATTACK_RESULT_REQUESTED, { result });
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
      view.placement.start();
      placementManager.subscribe();
    }
  };

  const combatHvHStrategy = {};

  const combatManager = {
    subscriptions: [{ event: TRACKING_GRID_EVENTS.ATTACK_SENT, callback: handlers.attackSent }],
    initialize: () => {
      subscriptionManager.scoped.subscribeMany(combatManager.subscriptions);
    }
  };

  stateManager.setFunctions.placement({ enterFns: placementManager.initialize });
  stateManager.setFunctions.progress({ enterFns: combatManager.initialize });

  return {
    getBoardElement: () => view.getBoardElement(),
    set: {
      displayContainer: (container) => view.setContainer(container),
      trackingFleet: (fleet) => view.trackingGrid.setFleet(fleet)
    },
    isAllShipsPlaced: () => model.isAllShipsPlaced(),
    getView: () => view,
    initializeStateManagement: () => stateManagerRegistry.registerManager(stateManager),
    view
  };
};
