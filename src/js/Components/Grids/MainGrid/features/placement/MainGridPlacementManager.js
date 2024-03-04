import { MainGridPlacementController } from './core/MainGridPlacementController';
import { EventEmitter } from '../../../../../Events/core/EventEmitter';
import { MAIN_GRID_PLACEMENT_EVENTS } from '../../common/mainGridEvents';

export const MainGridPlacementManager = (model, view, componentEmitter) => {
  const emitter = EventEmitter();
  const controller = MainGridPlacementController({ model, view });

  const handleInitialize = () => {
    componentEmitter.unsubscribe(MAIN_GRID_PLACEMENT_EVENTS.INITIALIZE, handleInitialize);
    componentEmitter.subscribeMany(COMPONENT_SUBSCRIPTIONS);
    controller.initialize(handleEnd, handlePlacement);
  };

  const handleUpdateOrientation = ({ data }) => {
    controller.updateOrientation(data);
  };

  const handleUpdateSelectedEntity = ({ data }) => {
    const { id, length, orientation } = data;
    controller.updateSelectedEntity(id, length, orientation);
  };

  const handleEnableSubmission = () => controller.enableSubmission();
  const handleDisableSubmission = () => controller.disableSubmission();

  const handlePlacement = (coordinates) => {
    if (!coordinates) return;
    emitter.publish(MAIN_GRID_PLACEMENT_EVENTS.PROCESSED_PLACED, coordinates);
  };
  const onPlacementProcessed = ({ data }) => {
    emitter.subscribe(MAIN_GRID_PLACEMENT_EVENTS.PROCESSED_PLACED, data);
  };
  const offPlacementProcessed = ({ data }) => {
    emitter.unsubscribe(MAIN_GRID_PLACEMENT_EVENTS.PROCESSED_PLACED, data);
  };

  const handleEnd = () => {
    emitter.reset();
    controller.end();
    componentEmitter.unsubscribeMany(COMPONENT_SUBSCRIPTIONS);
  };

  const COMPONENT_SUBSCRIPTIONS = [
    {
      event: MAIN_GRID_PLACEMENT_EVENTS.UPDATE_ORIENTATION,
      callback: handleUpdateOrientation
    },
    { event: MAIN_GRID_PLACEMENT_EVENTS.PLACE, callback: handlePlacement },
    {
      event: MAIN_GRID_PLACEMENT_EVENTS.SELECT,
      callback: handleUpdateSelectedEntity
    },
    {
      event: MAIN_GRID_PLACEMENT_EVENTS.ENABLE_SUBMIT,
      callback: handleEnableSubmission
    },
    {
      event: MAIN_GRID_PLACEMENT_EVENTS.DISABLE_SUBMIT,
      callback: handleDisableSubmission
    },
    { event: MAIN_GRID_PLACEMENT_EVENTS.END, callback: handleEnd },
    {
      event: MAIN_GRID_PLACEMENT_EVENTS.SUB_PLACED,
      callback: onPlacementProcessed
    },
    {
      event: MAIN_GRID_PLACEMENT_EVENTS.UNSUB_PLACED,
      callback: offPlacementProcessed
    }
  ];

  componentEmitter.subscribe(MAIN_GRID_PLACEMENT_EVENTS.INITIALIZE, handleInitialize);
};
