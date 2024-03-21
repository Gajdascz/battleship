import { MainGridPlacementController } from './core/MainGridPlacementController';
import { ManagerFactory } from '../../../../../Utility/ManagerFactory';

const MAIN_GRID_PLACEMENT_EVENTS = {
  PROCESSED_PLACEMENT: 'gridPlacementProcessed',
  SUBMIT: 'gridPlacementsFinalizationRequested'
};

/**
 * Facilitates cross-component, event-driven placement related communication.
 *
 * @param {Object} detail Initialization detail.
 * @param {Object} detail.model Main grid data model.
 * @param {Object} detail.view Main grid view interface.
 * @param {function} detail.createHandler Function to create event handler instance.
 * @returns {Object} Interface for the main grid's placement functionality.
 */
const MainGridPlacementManager = ({ model, view, createHandler }) => {
  const controller = MainGridPlacementController({ model, view });

  /**
   * @typedef {Object} place Encapsulates entity placement logic and event communication.
   * @property {function(coordinates)} execute Emits the coordinates at which an entity was placed.
   * @property {function(function)} on Subscribes a function to execute on the placement processed.
   * @property {function(function)} off Unsubscribes a function from the placement processed.
   * @property {function()} init Creates the event handler for the placement processed event.
   * @property {function()} end Resets the event handler.
   */
  /** @type {place}  */
  const place = {
    handler: null,
    execute: (coordinates) => {
      if (!coordinates) return;
      place.handler.emit(coordinates);
    },
    on: (callback) => place.handler.on(callback),
    off: (callback) => place.handler.off(callback),
    init: () => (place.handler = createHandler(MAIN_GRID_PLACEMENT_EVENTS.PROCESSED_PLACEMENT)),
    reset: () => place.handler.reset()
  };

  /**
   * @typedef {Object} submit Encapsulates placement submission logic and event communication.
   * @property {function(coordinates)} execute Emits the placement submission event.
   * @property {function(function)} on Subscribes a function to execute on the placements submitted event.
   * @property {function(function)} off Unsubscribes a function from the placements submitted event.
   * @property {function({boolean})} toggle Enables/Disables the submission button.
   * @property {function()} init Creates the event handler for the placements submitted event.
   * @property {function()} end Resets the event handler.
   */
  /** @type {submit}  */
  const submit = {
    handler: null,
    execute: () => {
      controller.reset();
      submit.handler.emit();
    },
    toggle: ({ data }) => controller.toggleSubmission(data),
    on: (callback) => submit.handler.on(callback),
    off: (callback) => submit.handler.off(callback),
    init: () => (submit.handler = createHandler(MAIN_GRID_PLACEMENT_EVENTS.SUBMIT)),
    reset: () => submit.handler.reset()
  };

  /**
   * Initializes placement and placement submission event handlers. Assigns callbacks to interface.
   */
  const start = () => {
    place.init();
    submit.init();
    controller.initialize(submit.execute, place.execute);
  };
  /**
   * Resets event handlers and the placement controller.
   */
  const end = () => {
    submit.reset();
    place.reset();
    controller.reset();
  };

  return {
    start,
    end,
    updateOrientation: ({ data }) => controller.updateOrientation(data),
    updateSelectedEntity: ({ data }) => {
      const { id, length, orientation } = data;
      controller.updateSelectedEntity(id, length, orientation);
    },
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
