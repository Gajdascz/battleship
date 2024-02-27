import { MainGridModel } from './model/MainGridModel';
import { MainGridView } from './view/MainGridView';
import { SHIP_EVENTS } from '../../Ship/events/shipEvents';
import { MainGridPlacementController } from './Placement/MainGridPlacementController';
import { MAIN_GRID_EVENTS } from './utility/mainGridEvents';
import { EventManager } from '../../../Events/management/EventManager';

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

  const placementManager = {
    subscribe: () => {
      subscriptionManager.normal.scoped.subscribe(
        SHIP_EVENTS.PLACEMENT.REQUESTED,
        placementManager.handle.placementRequest
      );
      subscriptionManager.normal.scoped.subscribe(
        MAIN_GRID_EVENTS.PLACEMENT.TOGGLE_PLACEMENT_SUBMISSION_REQUEST,
        placementManager.handle.toggleSubmitRequest
      );
      subscriptionManager.normal.scoped.subscribe(
        MAIN_GRID_EVENTS.PLACEMENT.FINALIZATION_REQUESTED,
        placementManager.handle.finalizePlacements
      );
      subscriptionManager.normal.scoped.subscribe(
        SHIP_EVENTS.SELECTION.SELECTED,
        placementManager.handle.select
      );
      subscriptionManager.normal.scoped.subscribe(
        SHIP_EVENTS.SELECTION.ORIENTATION_TOGGLED,
        placementManager.handle.orientationToggle
      );
    },
    unsubscribe: () => {
      subscriptionManager.normal.scoped.unsubscribe(
        SHIP_EVENTS.PLACEMENT.REQUESTED,
        placementManager.handle.placementRequest
      );
      subscriptionManager.normal.scoped.unsubscribe(
        MAIN_GRID_EVENTS.PLACEMENT.TOGGLE_PLACEMENT_SUBMISSION_REQUEST,
        placementManager.handle.toggleSubmitRequest
      );
      subscriptionManager.normal.scoped.unsubscribe(
        MAIN_GRID_EVENTS.PLACEMENT.FINALIZATION_REQUESTED,
        placementManager.handle.finalizePlacements
      );
      subscriptionManager.normal.scoped.unsubscribe(
        SHIP_EVENTS.SELECTION.SELECTED,
        placementManager.handle.select
      );
      subscriptionManager.normal.scoped.unsubscribe(
        SHIP_EVENTS.SELECTION.ORIENTATION_TOGGLED,
        placementManager.handle.orientationToggle
      );
    },
    initialize: () => {
      placementManager.subscribe();
      componentEmitter.publish(MAIN_GRID_EVENTS.PLACEMENT.INITIALIZE_REQUESTED);
    },
    handle: {
      select: ({ data }) => {
        componentEmitter.publish(MAIN_GRID_EVENTS.PLACEMENT.ENTITY_SELECTED, data);
      },
      orientationToggle: ({ data }) => {
        componentEmitter.publish(MAIN_GRID_EVENTS.PLACEMENT.ENTITY_ORIENTATION_UPDATED, data);
      },
      placementRequest: ({ data }) => {
        componentEmitter.publish(MAIN_GRID_EVENTS.PLACEMENT.ENTITY_PLACEMENT_REQUESTED, data);
      },
      toggleSubmitRequest: ({ data }) => {
        componentEmitter.publish(
          MAIN_GRID_EVENTS.PLACEMENT.TOGGLE_PLACEMENT_SUBMISSION_REQUEST,
          data
        );
      },
      finalizePlacements: ({ data }) => {
        console.log(data);
        componentEmitter.publish(MAIN_GRID_EVENTS.PLACEMENT.FINALIZATION_REQUESTED, data);
      }
    },
    end: () => {
      placementManager.unsubscribe();
      componentEmitter.publish(MAIN_GRID_EVENTS.PLACEMENT.END_REQUESTED);
    }
  };

  return {
    getModel: () => model,
    getView: () => view,
    getDimensions: () => model.getDimensions(),
    initializeStateManagement: () => placementManager.initialize()
  };
};
