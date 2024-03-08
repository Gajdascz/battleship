import { MainGridPlacementController } from './core/MainGridPlacementController';
import { MAIN_GRID_PLACEMENT_EVENTS } from '../../common/mainGridEvents';
import { ManagerFactory } from '../../../../../Utility/ManagerFactory';
const MainGridPlacementManager = ({ model, view, createHandler }) => {
  const controller = MainGridPlacementController({ model, view });

  const updateSelectedEntity = ({ data }) => {
    const { id, length, orientation } = data;
    controller.updateSelectedEntity(id, length, orientation);
  };
  const updateOrientation = ({ data }) => controller.updateOrientation(data);

  const place = {
    handler: null,
    execute: (coordinates) => {
      if (!coordinates) return;
      place.handler.emit(coordinates);
    },
    on: (callback) => place.handler.on(callback),
    off: (callback) => place.handler.off(callback),
    start: () => (place.handler = createHandler(MAIN_GRID_PLACEMENT_EVENTS.PROCESSED_PLACED)),
    end: () => place.handler.reset()
  };

  const submit = {
    handler: null,
    execute: () => {
      controller.end();
      submit.handler.emit();
    },
    toggle: ({ data }) => controller.toggleSubmission(data),
    on: (callback) => submit.handler.on(callback),
    off: (callback) => submit.handler.off(callback),
    start: () => (submit.handler = createHandler(MAIN_GRID_PLACEMENT_EVENTS.SUBMIT)),
    end: () => submit.handler.reset()
  };

  const start = () => {
    place.start();
    submit.start();
    controller.initialize(submit.execute, place.execute);
  };
  const end = () => {
    submit.end();
    place.end();
    controller.end();
  };

  return {
    start,
    end,
    updateOrientation,
    updateSelectedEntity,
    toggleSubmit: (isReady) => submit.toggle(isReady),
    onPlace: (callback) => place.on(callback),
    offPlace: (callback) => place.off(callback),
    onSubmit: (callback) => submit.on(callback),
    offSubmit: (callback) => submit.off(callback)
  };
};

export const PlacementManagerFactory = ({ model, view, createHandler }) =>
  ManagerFactory({
    ManagerBuilder: MainGridPlacementManager,
    initialDetails: { model, view, createHandler },
    validateDetails: (details) => details.model && details.view && details.createHandler
  });
