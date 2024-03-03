import { MainGridPlacementController } from './core/MainGridPlacementController';
import { EventEmitter } from '../../../../../Events/core/EventEmitter';
import { MAIN_GRID_EVENTS } from '../../common/mainGridEvents';

export const MainGridPlacementManager = (model, view, componentEmitter) => {
  const emitter = EventEmitter();
  const controller = MainGridPlacementController({ model, view });

  const handleInitialize = () => {
    componentEmitter.unsubscribe(MAIN_GRID_EVENTS.PLACEMENT.REQUEST.INITIALIZE, handleInitialize);
    componentEmitter.subscribeMany(COMPONENT_SUBSCRIPTIONS);
    controller.initialize(handleEnd);
  };
  const handleEnd = () => {
    emitter.reset();
    controller.end();
    componentEmitter.unsubscribeMany(COMPONENT_SUBSCRIPTIONS);
  };
  const handleUpdateOrientation = ({ data }) => {
    const { orientation } = data;
    controller.updateOrientation(orientation);
  };
  const handlePlacement = ({ data }) => {
    const { id, length } = data;
    const placedCoordinates = controller.requestPlacement(id, length);
    if (!placedCoordinates) return;
    emitter.publish(
      MAIN_GRID_EVENTS.PLACEMENT.DECLARE.ENTITY_PLACEMENT_PROCESSED,
      placedCoordinates
    );
  };
  const handleUpdateSelectedEntity = ({ data }) => {
    const { id, length, orientation } = data;
    controller.updateSelectedEntity(id, length, orientation);
  };

  const handleEnableSubmission = () => controller.enableSubmission();
  const handleDisableSubmission = () => controller.disableSubmission();

  const onPlacementProcessed = ({ data }) => {
    const { callback } = data;
    emitter.subscribe(MAIN_GRID_EVENTS.PLACEMENT.DECLARE.ENTITY_PLACEMENT_PROCESSED, callback);
  };
  const offPlacementProcessed = ({ data }) => {
    const { callback } = data;
    emitter.unsubscribe(MAIN_GRID_EVENTS.PLACEMENT.DECLARE.ENTITY_PLACEMENT_PROCESSED, callback);
  };

  const COMPONENT_SUBSCRIPTIONS = [
    {
      event: MAIN_GRID_EVENTS.PLACEMENT.REQUEST.ENTITY_ORIENTATION_UPDATE,
      callback: handleUpdateOrientation
    },
    { event: MAIN_GRID_EVENTS.PLACEMENT.REQUEST.ENTITY_PLACEMENT, callback: handlePlacement },
    {
      event: MAIN_GRID_EVENTS.PLACEMENT.REQUEST.ENTITY_SELECT,
      callback: handleUpdateSelectedEntity
    },
    {
      event: MAIN_GRID_EVENTS.PLACEMENT.REQUEST.ENABLE_PLACEMENT_SUBMISSION,
      callback: handleEnableSubmission
    },
    {
      event: MAIN_GRID_EVENTS.PLACEMENT.REQUEST.DISABLE_PLACEMENT_SUBMISSION,
      callback: handleDisableSubmission
    },
    { event: MAIN_GRID_EVENTS.PLACEMENT.REQUEST.END, callback: handleEnd },
    {
      event: MAIN_GRID_EVENTS.PLACEMENT.REQUEST.SUB_PLACEMENT_PROCESSED,
      callback: onPlacementProcessed
    },
    {
      event: MAIN_GRID_EVENTS.PLACEMENT.REQUEST.UNSUB_PLACEMENT_PROCESSED,
      callback: offPlacementProcessed
    }
  ];

  componentEmitter.subscribe(MAIN_GRID_EVENTS.PLACEMENT.REQUEST.INITIALIZE, handleInitialize);
};
