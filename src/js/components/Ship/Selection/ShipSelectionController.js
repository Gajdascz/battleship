import { KEY_EVENTS } from '../../../utility/constants/events';
import { PUBLISHER_KEYS } from '../utility/buildPublisher';

export const ShipSelectionController = ({ model, view, publisher }) => {
  let pickupFn = null;
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
    view.update.orientation(orientation);
    publisher.execute(PUBLISHER_KEYS.ACTIONS.ORIENTATION_TOGGLED, {
      length: model.getLength(),
      orientation
    });
  };
  const request = () =>
    publisher.request(PUBLISHER_KEYS.REQUESTS.SELECTION, { scopedID: model.getScopedID() });

  const select = () => {
    if (model.isPlaced() && pickupFn) pickupFn();
    view.selection.orientationToggle.enable();
    model.setIsSelected(true);
    view.update.selectedStatus(true);
    publisher.execute(PUBLISHER_KEYS.ACTIONS.SELECTED, {
      id: model.getID(),
      scopedID: model.getScopedID(),
      scope: model.getScope(),
      length: model.getLength(),
      orientation: model.getOrientation()
    });
    view.placement.place.enable();
  };
  const deselect = () => {
    view.selection.orientationToggle.disable();
    view.placement.place.disable();
    view.update.selectedStatus(false);
    model.setIsSelected(false);
    publisher.execute(PUBLISHER_KEYS.ACTIONS.DESELECTED, {
      scopedID: model.getScopedID()
    });
  };

  return {
    enable: () => {
      view.selection.initialize({
        selectCallback: request,
        toggleOrientationCallback: toggleOrientation
      });
    },
    select,
    deselect,
    setPickupFn: (fn) => (pickupFn = fn)
  };
};
