import { SHIP_SELECTION_EVENTS } from '../../common/shipEvents';
import { ShipSelectionController } from './selection/ShipSelectionController';
import { ShipPlacementController } from './placement/ShipPlacementController';

export const ShipSelectionAndPlacementManager = ({ model, view, emitter }) => {
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

  const start = () => {
    console.log('shipStart');
    selectionController.initialize(selectionHandler.emit, orientationHandler.emit);
  };

  const place = (coordinates) => {
    placementController.place(coordinates);
    deselect();
  };

  const deselect = () => selectionController.deselect();

  const end = () => {
    selectionController.end();
    orientationHandler.reset();
    selectionHandler.reset();
  };

  const select = () => {
    console.log(model.getId());
    if (isPlaced()) placementController.pickup();
    selectionController.select();
  };

  const getSelectData = () => ({
    id: model.getId(),
    length: model.getLength(),
    orientation: model.getOrientation()
  });

  const orientationHandler = emitter.createHandler(
    SHIP_SELECTION_EVENTS.ORIENTATION_TOGGLED,
    model.getOrientation
  );
  const selectionHandler = emitter.createHandler(SHIP_SELECTION_EVENTS.SELECTED, getSelectData);

  return {
    isSelected,
    isPlaced,
    getRotateButton,
    start,
    end,
    place,
    select,
    deselect: () => deselect(),
    onSelect: (callback) => selectionHandler.on(callback),
    offSelect: (callback) => selectionHandler.off(callback),
    onOrientationToggle: (callback) => orientationHandler.on(callback),
    offOrientationToggle: (callback) => orientationHandler.off(callback)
  };
};
