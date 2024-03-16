import { SHIP_PLACEMENT_EVENTS, SHIP_SELECTION_EVENTS } from '../../common/shipEvents';
import { ShipSelectionController } from './selection/ShipSelectionController';
import { ShipPlacementController } from './placement/ShipPlacementController';
import { ManagerFactory } from '../../../../Utility/ManagerFactory';

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

  const start = () => {
    select.init();
    orientation.init();
    place.init();
    selectionController.initialize(select.request, orientation.request);
  };

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
