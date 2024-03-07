import { MainGridPlacementController } from './core/MainGridPlacementController';
import { MAIN_GRID_PLACEMENT_EVENTS } from '../../common/mainGridEvents';

export const MainGridPlacementManager = ({ model, view, emitter }) => {
  const controller = MainGridPlacementController({ model, view });

  const start = () => controller.initialize(submitPlacements, place);

  const updateOrientation = ({ data }) => controller.updateOrientation(data);

  const updateSelectedEntity = ({ data }) => {
    const { id, length, orientation } = data;
    controller.updateSelectedEntity(id, length, orientation);
  };

  const orientationHandler = emitter.createHandler(
    MAIN_GRID_PLACEMENT_EVENTS.UPDATE_ORIENTATION,
    updateOrientation
  );
  const selectHandler = emitter.createHandler(
    MAIN_GRID_PLACEMENT_EVENTS.SELECT,
    updateSelectedEntity
  );

  const toggleSubmission = (isReady) => {
    if (isReady) controller.enableSubmission();
    else controller.disableSubmission();
  };
  const toggleSubmitHandler = emitter.createHandler(
    MAIN_GRID_PLACEMENT_EVENTS.TOGGLE_SUBMIT,
    toggleSubmission
  );

  const submitPlacements = () => {
    emitter.publish(MAIN_GRID_PLACEMENT_EVENTS.SUBMITTED);
    controller.end();
  };
  const submitHandler = emitter.createHandler(MAIN_GRID_PLACEMENT_EVENTS.SUBMIT, submitPlacements);

  const place = (coordinates) => {
    if (!coordinates) return;
    emitter.publish(MAIN_GRID_PLACEMENT_EVENTS.PROCESSED_PLACED, coordinates);
  };
  const placeHandler = emitter.createHandler(MAIN_GRID_PLACEMENT_EVENTS.PROCESSED_PLACED, place);

  const end = () => {
    placeHandler.reset();
    submitHandler.reset();
    orientationHandler.reset();
    selectHandler.reset();
  };

  return {
    start,
    end,
    toggleSubmission: (isReady) => toggleSubmitHandler.emit(isReady),
    updateOrientation: (orientation) => orientationHandler.emit(orientation),
    updateSelectedEntity: (entityData) => selectHandler.emit(entityData),
    onPlace: (callback) => placeHandler.on(callback),
    offPlace: (callback) => placeHandler.off(callback),
    onSubmit: (callback) => submitHandler.on(callback),
    offSubmit: (callback) => submitHandler.off(callback)
  };
};
