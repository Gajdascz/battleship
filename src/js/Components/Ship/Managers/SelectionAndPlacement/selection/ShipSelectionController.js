import { KEY_EVENTS } from '../../../../../Utility/constants/dom/domEvents';
import { ShipSelectionView } from './ShipSelectionView';

/**
 * Initializes a ShipSelectionController which provides a cohesive interface for updating a ship's selected state and corresponding interface view.
 *
 * @param {Object} detail Contains ship model and view.
 * @returns {Object} Interface for manipulating ship's selection data and view.
 */
export const ShipSelectionController = ({ model, view }) => {
  let isInitialized = false;
  let isEnabled = false;

  const selectionView = ShipSelectionView({
    mainShipElement: view.elements.getMainShip(),
    rotateButtonElement: view.elements.getRotateButton()
  });

  /**
   * Sets the ship's selected status and updates the view.
   */
  const select = () => {
    if (model.isSelected()) return;
    selectionView.update.selectedStatus(true);
    selectionView.enable.orientationToggle();
    model.setIsSelected(true);
  };
  /**
   * Removes the ship's selected status and updates the view.
   */
  const deselect = () => {
    if (!model.isSelected()) return;
    selectionView.disable.orientationToggle();
    selectionView.update.selectedStatus(false);
    model.setIsSelected(false);
  };

  /**
   * Updates the ship's orientation state and view.
   *
   * @param {Event} e DOM-level event detail.
   */
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

  /**
   * Enables ship selection logic.
   */
  const enable = () => {
    if (isEnabled) return;
    selectionView.enable.select();
    isEnabled = true;
  };
  /**
   * Disables ship selection logic.
   */
  const disable = () => {
    if (!isEnabled) return;
    selectionView.disable.all();
    isEnabled = false;
  };
  /**
   * Disables selection logic and resets the view.
   */
  const reset = () => {
    if (!isInitialized) return;
    disable();
    selectionView.reset();
    isInitialized = false;
  };
  return {
    initialize,
    reset,
    select,
    deselect,
    toggleOrientation,
    enable,
    disable
  };
};
