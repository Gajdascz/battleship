// Main Grid Component
import { MainGridPlacementController } from './core/MainGridPlacementController';
import { MAIN_GRID_EVENTS } from '../../common/mainGridEvents';

// External
import { SHIP_EVENTS } from '../../../../../Events/events';

export const MainGridPlacementManager = ({
  model,
  view,
  publisher,
  componentEmitter,
  subscriptionManager
}) => {
  MainGridPlacementController({
    model,
    view,
    publisher,
    componentEmitter
  });

  const emit = {
    initialize: () => componentEmitter.publish(MAIN_GRID_EVENTS.PLACEMENT.INITIALIZE_REQUESTED),
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
    end: () => componentEmitter.publish(MAIN_GRID_EVENTS.PLACEMENT.END_REQUESTED)
  };

  const subscriptions = [
    {
      event: SHIP_EVENTS.PLACEMENT.REQUESTED,
      callback: emit.placementRequest
    },
    {
      event: MAIN_GRID_EVENTS.PLACEMENT.TOGGLE_PLACEMENT_SUBMISSION_REQUEST,
      callback: emit.toggleSubmitRequest
    },
    {
      event: MAIN_GRID_EVENTS.PLACEMENT.FINALIZATION_REQUESTED,
      callback: emit.finalizePlacements
    },
    { event: SHIP_EVENTS.SELECTION.SELECTED, callback: emit.select },
    {
      event: SHIP_EVENTS.SELECTION.ORIENTATION_TOGGLED,
      callback: emit.orientationToggle
    }
  ];
  const subscribe = () => subscriptionManager.scoped.subscribeMany(subscriptions);
  const unsubscribe = () => subscriptionManager.scoped.unsubscribeMany(subscriptions);

  return {
    initialize: () => {
      emit.initialize();
      subscribe();
    },
    end: () => {
      emit.end();
      unsubscribe();
    }
  };
};
