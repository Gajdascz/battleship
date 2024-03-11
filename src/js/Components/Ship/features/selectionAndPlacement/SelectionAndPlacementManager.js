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
    start: () => (place.handler = createHandler(SHIP_PLACEMENT_EVENTS.PLACED)),
    end: () => place.handler.reset()
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
    start: () => (select.handler = createHandler(SHIP_SELECTION_EVENTS.SELECTED, select.getData)),
    end: () => select.handler.reset()
  };

  const orientation = {
    handler: null,
    request: () => orientation.handler.emit(),
    on: (callback) => orientation.handler.on(callback),
    off: (callback) => orientation.handler.off(callback),
    start: () =>
      (orientation.handler = createHandler(
        SHIP_SELECTION_EVENTS.ORIENTATION_TOGGLED,
        model.getOrientation
      )),
    end: () => orientation.handler.reset()
  };

  const start = () => {
    select.start();
    orientation.start();
    place.start();
    selectionController.initialize(select.request, orientation.request);
  };

  const end = () => {
    select.end();
    orientation.end();
    place.end();
    selectionController.end();
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
