import { MainGridPlacementController } from './core/MainGridPlacementController';
import { EventEmitter } from '../../../../../Events/core/EventEmitter';
import { MAIN_GRID_EVENTS } from '../../common/mainGridEvents';
export const MainGridPlacementManager = (model, view) => {
  const emitter = EventEmitter();
  const controller = MainGridPlacementController({ model, view });

  return {
    initialize: () => emitter.publish(MAIN_GRID_EVENTS.PLACEMENT.INITIALIZE_REQUESTED),
    end: () => controller.end(),
    orientationUpdate: ({ data }) => {
      const { orientation } = data;
      controller.updateOrientation(orientation);
    },
    placement: ({ data }) => {
      const { id, length } = data;
      const placedCoordinates = controller.requestPlacement(id, length);
      if (!placedCoordinates) return;
      emitter.publish(MAIN_GRID_EVENTS.PLACEMENT.ENTITY_PLACEMENT_PROCESSED, placedCoordinates);
    },
    selectedEntityUpdate: ({ data }) => {
      const { id, length, orientation } = data;
      controller.updateSelectedEntity(id, length, orientation);
    },
    onPlacementProcessed: (callback) =>
      emitter.subscribe(MAIN_GRID_EVENTS.PLACEMENT.ENTITY_PLACEMENT_PROCESSED, callback),
    offPlacementProcessed: (callback) =>
      emitter.unsubscribe(MAIN_GRID_EVENTS.PLACEMENT.ENTITY_PLACEMENT_PROCESSED, callback),
    onPlacementsSubmitted: () => {
      controller.end();
      emitter.publish(MAIN_GRID_EVENTS.PLACEMENT.FINALIZED);
    },
    getIsPlacementFinalized: () => controller.isPlacementFinalized
  };
};
