import { MainGridModel } from './model/MainGridModel';
import { MainGridView } from './view/MainGridView';
import { SHIP_EVENTS } from '../../Ship/events/shipEvents';
import { MainGridPlacementController } from './Placement/MainGridPlacementController';
import { MAIN_GRID_EVENTS } from './utility/mainGridEvents';
import { EventManager } from '../../../Events/management/EventManager';
import { GameStateManager } from '../../../State/GameStateManager';
import stateManagerRegistry from '../../../State/stateManagerRegistry';
import { GAME_EVENTS } from '../../Game/utility/gameEvents';
export const MainGridController = (scope, boardConfig) => {
  const { numberOfRows, numberOfCols, letterAxis } = boardConfig;
  const model = MainGridModel(scope, { numberOfRows, numberOfCols, letterAxis });
  const view = MainGridView({ numberOfRows, numberOfCols, letterAxis });
  const { publisher, subscriptionManager, componentEmitter } = EventManager(scope);
  MainGridPlacementController({
    model,
    view,
    publisher,
    componentEmitter
  });

  const stateManager = GameStateManager(model.getScopedID());

  const handlers = {
    select: ({ data }) =>
      componentEmitter.publish(MAIN_GRID_EVENTS.PLACEMENT.ENTITY_SELECTED, data),
    orientationToggle: ({ data }) =>
      componentEmitter.publish(MAIN_GRID_EVENTS.PLACEMENT.ENTITY_ORIENTATION_UPDATED, data),
    placementRequest: ({ data }) =>
      componentEmitter.publish(MAIN_GRID_EVENTS.PLACEMENT.ENTITY_PLACEMENT_REQUESTED, data),
    toggleSubmitRequest: ({ data }) =>
      componentEmitter.publish(
        MAIN_GRID_EVENTS.PLACEMENT.TOGGLE_PLACEMENT_SUBMISSION_REQUEST,
        data
      ),
    finalizePlacements: ({ data }) =>
      componentEmitter.publish(MAIN_GRID_EVENTS.PLACEMENT.FINALIZATION_REQUESTED, data),
    acceptAttackRequest: ({ data }) => {
      const { coordinates } = data;
      const result = model.processIncomingAttack(coordinates);
      publisher.scoped.noFulfill(MAIN_GRID_EVENTS.COMBAT.INCOMING_ATTACK_PROCESSED, { result });
    }
  };

  const placementManager = {
    subscriptions: [
      {
        event: SHIP_EVENTS.PLACEMENT.REQUESTED,
        callback: handlers.placementRequest
      },
      {
        event: MAIN_GRID_EVENTS.PLACEMENT.TOGGLE_PLACEMENT_SUBMISSION_REQUEST,
        callback: handlers.toggleSubmitRequest
      },
      {
        event: MAIN_GRID_EVENTS.PLACEMENT.FINALIZATION_REQUESTED,
        callback: handlers.finalizePlacements
      },
      { event: SHIP_EVENTS.SELECTION.SELECTED, callback: handlers.select },
      {
        event: SHIP_EVENTS.SELECTION.ORIENTATION_TOGGLED,
        callback: handlers.orientationToggle
      }
    ],
    subscribe: () => subscriptionManager.scoped.subscribeMany(placementManager.subscriptions),
    unsubscribe: () => subscriptionManager.all.unsubscribe(),
    initialize: () => {
      placementManager.subscribe();
      componentEmitter.publish(MAIN_GRID_EVENTS.PLACEMENT.INITIALIZE_REQUESTED);
    },

    end: () => {
      placementManager.unsubscribe();
      componentEmitter.publish(MAIN_GRID_EVENTS.PLACEMENT.END_REQUESTED);
      componentEmitter.reset();
    }
  };

  const combatManager = {
    subscriptions: [
      {
        event: MAIN_GRID_EVENTS.COMBAT.INCOMING_ATTACK_REQUESTED,
        callback: handlers.acceptAttackRequest
      }
    ],
    initialize: () => {
      subscriptionManager.scoped.subscribeMany(combatManager.subscriptions);
    }
  };

  stateManager.setFunctions.placement({
    enterFns: placementManager.initialize,
    exitFns: placementManager.end
  });
  stateManager.setFunctions.progress({
    enterFns: combatManager.initialize
  });

  return {
    getDimensions: () => model.getDimensions(),
    getModel: () => model,
    getView: () => view,
    getEntityPlacements: () => model.getEntityPlacements(),
    initializeStateManagement: () => stateManagerRegistry.registerManager(stateManager)
  };
};
