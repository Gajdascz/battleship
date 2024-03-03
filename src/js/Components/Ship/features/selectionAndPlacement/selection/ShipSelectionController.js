import { KEY_EVENTS } from '../../../../../Utility/constants/dom/domEvents';
import { ShipSelectionView } from './ShipSelectionView';

export const ShipSelectionController = ({ model, view }) => {
  let isInitialized = false;
  let isEnabled = false;

  const selectionView = ShipSelectionView({
    mainShipElement: view.elements.getMainShip(),
    rotateButtonElement: view.elements.getRotateButton()
  });

  const select = () => {
    if (model.isSelected()) return;
    selectionView.update.selectedStatus(true);
    selectionView.enable.orientationToggle();
    model.setIsSelected(true);
  };
  const deselect = () => {
    if (!model.isSelected()) return;
    selectionView.disable.orientationToggle();
    selectionView.update.selectedStatus(false);
    model.setIsSelected(false);
  };

  const toggleOrientation = (e) => {
    const isRotateRequest = (e) =>
      e.code === KEY_EVENTS.CODES.SPACE ||
      e.code === KEY_EVENTS.CODES.R ||
      e.button === 1 ||
      (e.target.classList.contains('rotate-ship-button') && e instanceof PointerEvent);
    if (!isRotateRequest(e)) return;
    e.preventDefault();
    model.toggleOrientation();
    const orientation = model.getOrientation();
    selectionView.update.orientation(orientation);
    return orientation;
  };

  const initialize = (requestSelectionCallback) => {
    if (isInitialized) return;
    selectionView.initialize({
      requestSelectionCallback,
      toggleOrientationCallback: toggleOrientation
    });
    enable();
    isInitialized = true;
  };

  const enable = () => {
    if (isEnabled) return;
    selectionView.enable.select();
    isEnabled = true;
  };
  const disable = () => {
    if (!isEnabled) return;
    selectionView.disable.all();
    isEnabled = false;
  };
  const end = () => {
    if (!isInitialized) return;
    disable();
    selectionView.end();
    isInitialized = false;
  };
  return {
    initialize,
    end,
    select,
    deselect,
    toggleOrientation,
    enable,
    disable
  };
};

// const emit = {
//   orientationToggled: () => {
//     componentEmitter.publish(SHIP_EVENTS.SELECTION.ORIENTATION_TOGGLED, {
//       orientation: model.getOrientation()
//     });
//   },
//   requestSelection: () => {
//     console.log(model.getScopedID());
//     componentEmitter.publish(SHIP_EVENTS.SELECTION.SELECTION_REQUESTED, {
//       scopedID: model.getScopedID()
//     });
//   },
//   selected: () => {
//     componentEmitter.publish(SHIP_EVENTS.SELECTION.SELECTED, {
//       id: model.getID(),
//       scopedID: model.getScopedID(),
//       scope: model.getScope(),
//       length: model.getLength(),
//       orientation: model.getOrientation()
//     });
//   },
//   deselected: () => {
//     componentEmitter.publish(SHIP_EVENTS.SELECTION.DESELECTED, { scopedID: model.getScopedID() });
//   }
// };
// const stateManager = {
//   isEnabled: false,
//   isInitialized: false,
//   initialize: () => {
//     if (stateManager.isInitialized) return;
//     selectionView.initialize({
//       requestSelectionCallback: emit.requestSelection,
//       toggleOrientationCallback: execute.toggleOrientation
//     });
//     stateManager.enable();
//     stateManager.isInitialized = true;
//     componentEmitter.subscribe(SHIP_EVENTS.SELECTION.OVER, stateManager.end);
//   },
//   enable: () => {
//     if (stateManager.isEnabled) return;
//     componentEmitter.subscribe(SHIP_EVENTS.SELECTION.SELECTION_REQUESTED, execute.select);
//     componentEmitter.subscribe(SHIP_EVENTS.SELECTION.DESELECT_REQUESTED, execute.deselect);
//     selectionView.enable.select();
//     stateManager.isEnabled = true;
//   },
//   disable: () => {
//     if (!stateManager.isEnabled) return;
//     componentEmitter.unsubscribe(SHIP_EVENTS.SELECTION.SELECTION_REQUESTED, execute.select);
//     componentEmitter.unsubscribe(SHIP_EVENTS.SELECTION.DESELECT_REQUESTED, execute.deselect);
//     selectionView.disable.all();
//     stateManager.isEnabled = false;
//   },
//   end: () => {
//     if (!stateManager.isInitialized) return;
//     stateManager.disable();
//     selectionView.end();
//     stateManager.isInitialized = false;
//     componentEmitter.unsubscribe(SHIP_EVENTS.SELECTION.OVER, stateManager.end);
//   }
// };

// componentEmitter.subscribe(SHIP_EVENTS.SELECTION.INITIALIZE_REQUESTED, stateManager.initialize);
// const execute = {
//   select: () => {
//     selectionView.update.selectedStatus(true);
//     selectionView.enable.orientationToggle();
//     model.setIsSelected(true);
//     emit.selected();
//   },
//   deselect: () => {
//     selectionView.disable.orientationToggle();
//     selectionView.update.selectedStatus(false);
//     model.setIsSelected(false);
//     emit.deselected();
//   },
//   toggleOrientation: (e) => {
//     const isRotateRequest = (e) =>
//       e.code === KEY_EVENTS.CODES.SPACE ||
//       e.code === KEY_EVENTS.CODES.R ||
//       e.button === 1 ||
//       (e.target.classList.contains('rotate-ship-button') && e instanceof PointerEvent);
//     if (!isRotateRequest(e)) return;
//     e.preventDefault();
//     model.toggleOrientation();
//     const orientation = model.getOrientation();
//     selectionView.update.orientation(orientation);
//     emit.orientationToggled();
//   }
// };
