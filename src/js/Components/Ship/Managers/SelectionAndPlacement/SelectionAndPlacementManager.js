import { ShipSelectionController } from './selection/ShipSelectionController';
import { ShipPlacementController } from './placement/ShipPlacementController';
import { ManagerFactory } from '../../../../Utility/ManagerFactory';

const SHIP_SELECTION_EVENTS = {
  SELECTED: 'shipSelected',
  ORIENTATION_TOGGLED: 'shipOrientationToggled'
};
const SHIP_PLACEMENT_EVENTS = {
  PLACED: 'shipPlaced'
};

/**
 * Handles ship selection and placement related cross-component, event-drive communication.
 *
 * @param {Object} detail Initialization detail.
 * @param {Object} detail.model Ship data model.
 * @param {Object} detail.view Ship view interface.
 * @param {function} detail.createHandler Method for creating an EventHandler instance.
 * @returns {Object} Interface providing ship selection and placement capabilities.
 */
const ShipSelectionAndPlacementManager = ({ model, view, createHandler }) => {
  const selectionController = ShipSelectionController({
    model,
    view
  });
  const placementController = ShipPlacementController({
    model,
    view
  });

  const isSelected = () => model.isSelected();
  const isPlaced = () => model.isPlaced();
  const getRotateButton = () => view.elements.getRotateButton();
  /**
   * @typedef {Object} place Encapsulates the ship's placement logic and event communications.
   * @property {function()} execute Updates the user interface and Executes the place method (sets ship's placement coordinates) then emits the event.
   * @property {function(function): void} on Subscribes a callback to execute when a ship place event occurs.
   * @property {function(function): void} off Unsubscribes a callback from the ship place event.
   * @property {function()} init Creates the event handler for the ship place event. Allows external components to respond to this event.
   * @property {function()} reset Resets the handler to its initial state.
   */
  /** @type {place} */
  const place = {
    handler: null,
    execute: (coordinates) => {
      placementController.place(coordinates);
      select.deselect();
      place.handler.emit();
    },
    on: (callback) => place.handler.on(callback),
    off: (callback) => place.handler.off(callback),
    init: () => (place.handler = createHandler(SHIP_PLACEMENT_EVENTS.PLACED)),
    reset: () => place.handler.reset()
  };

  /**
   * @typedef {Object} select Encapsulates the ship's selection logic and event communication.
   * @property {function()} execute Updates the user interface and Executes the select method (sets selected state) then emits the selected ship's data.
   * @property {function()} request Emits a ship selection request event.
   * @property {function()} deselect Removes the ship selected state.
   * @property {function()} getData Provides selected ship data.
   * @property {function(function): void} on Subscribes a callback to execute when a ship select event occurs.
   * @property {function(function): void} off Unsubscribes a callback from the ship select event.
   * @property {function()} init Creates the event handler for the ship select event. Allows external components to respond to this event.
   * @property {function()} reset Resets the handler to its initial state.
   */
  /** @type {select} */
  const select = {
    handler: null,
    execute: () => {
      if (isPlaced()) placementController.pickup();
      selectionController.select();
    },
    request: () => select.handler.emit(),
    deselect: () => selectionController.deselect(),
    getData: () => ({
      id: model.id,
      length: model.length,
      orientation: model.getOrientation()
    }),
    on: (callback) => select.handler.on(callback),
    off: (callback) => select.handler.off(callback),
    init: () => (select.handler = createHandler(SHIP_SELECTION_EVENTS.SELECTED, select.getData)),
    reset: () => select.handler.reset()
  };

  /**
   * @typedef {Object} orientation Encapsulates the ship's orientation logic and event communication.
   * @property {function()} request Emits a request event to toggle the ship's orientation property.
   * @property {function(function): void} on Subscribes a callback to execute when a ship orientation toggled event occurs.
   * @property {function(function): void} off Unsubscribes a callback from the ship orientation toggled event.
   * @property {function()} init Creates the event handler for the ship orientation toggled event. Allows external components to respond to this event.
   * @property {function()} reset Resets the handler to its initial state.
   */
  /** @type {orientation} */
  const orientation = {
    handler: null,
    request: () => orientation.handler.emit(),
    on: (callback) => orientation.handler.on(callback),
    off: (callback) => orientation.handler.off(callback),
    init: () =>
      (orientation.handler = createHandler(
        SHIP_SELECTION_EVENTS.ORIENTATION_TOGGLED,
        model.getOrientation
      )),
    reset: () => orientation.handler.reset()
  };

  /** Initializes the ship's placement and selection handlers. Assigns the orientation request emit function to the user interface.  */
  const start = () => {
    select.init();
    orientation.init();
    place.init();
    selectionController.initialize(select.request, orientation.request);
  };

  /** Resets the ship's selection and placement logic and event handlers. */
  const end = () => {
    select.reset();
    orientation.reset();
    place.reset();
    selectionController.reset();
  };

  return {
    isSelected,
    isPlaced,
    getRotateButton,
    start,
    end,
    place: (coordinates) => place.execute(coordinates),
    select: () => select.execute(),
    deselect: () => select.deselect(),
    onSelected: (callback) => select.on(callback),
    offSelected: (callback) => select.off(callback),
    onPlaced: (callback) => place.on(callback),
    offPlaced: (callback) => place.off(callback),
    onOrientationToggled: (callback) => orientation.on(callback),
    offOrientationToggled: (callback) => orientation.off(callback)
  };
};

export const SelectionAndPlacementManagerFactory = ({ model, view, createHandler }) =>
  ManagerFactory({
    ManagerBuilder: ShipSelectionAndPlacementManager,
    initialDetails: { model, view, createHandler },
    validateDetails: (details) => details.model && details.view && details.createHandler
  });
