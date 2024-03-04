import { KEY_EVENTS } from '../../../../../Utility/constants/dom/domEvents';
import { ShipSelectionView } from './ShipSelectionView';

export const ShipSelectionController = ({ model, view }) => {
  let isInitialized = false;
  let isEnabled = false;

  const selectionView = ShipSelectionView({
    mainShipElement: view.elements.getMainShip().element,
    rotateButtonElement: view.elements.getRotateButton().element
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
    if (!isRotateRequest(e)) return false;
    e.preventDefault();
    model.toggleOrientation();
    const orientation = model.getOrientation();
    selectionView.update.orientation(orientation);
    return true;
  };

  const initialize = (requestSelectionCallback, requestOrientationToggleCallback) => {
    if (isInitialized) return;
    const toggleOrientationCallback = (e) => {
      if (toggleOrientation(e)) requestOrientationToggleCallback();
    };
    selectionView.initialize({
      requestSelectionCallback,
      toggleOrientationCallback
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
