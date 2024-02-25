import { KEY_EVENTS } from '../../../utility/constants/events';
import { PUBLISHER_KEYS } from '../events/buildPublisher';
import { SHIP_EVENTS } from '../events/shipEvents';
import { ShipSelectionView } from './ShipSelectionView';

export const ShipSelectionController = ({ model, view, publisher, componentEventEmitter }) => {
  const selectionView = ShipSelectionView({
    mainShipElement: view.elements.getMainShip(),
    rotateButtonElement: view.elements.getRotateButton()
  });

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
    publisher.execute(PUBLISHER_KEYS.ACTIONS.ORIENTATION_TOGGLED, {
      length: model.getLength(),
      orientation
    });
  };
  const request = () =>
    publisher.request(PUBLISHER_KEYS.REQUESTS.SELECTION, { scopedID: model.getScopedID() });

  const select = () => {
    selectionView.update.selectedStatus(true);
    selectionView.orientationToggle.enable();
    model.setIsSelected(true);
    publisher.execute(PUBLISHER_KEYS.ACTIONS.SELECTED, {
      id: model.getID(),
      scopedID: model.getScopedID(),
      scope: model.getScope(),
      length: model.getLength(),
      orientation: model.getOrientation()
    });
    componentEventEmitter.publish(SHIP_EVENTS.SELECTION.SELECTED);
  };
  const deselect = () => {
    selectionView.orientationToggle.disable();
    selectionView.update.selectedStatus(false);
    model.setIsSelected(false);
    publisher.execute(PUBLISHER_KEYS.ACTIONS.DESELECTED, {
      scopedID: model.getScopedID()
    });
    componentEventEmitter.publish(SHIP_EVENTS.SELECTION.DESELECTED);
  };

  return {
    initialize: () => {
      selectionView.initialize({
        requestSelectionCallback: request,
        toggleOrientationCallback: toggleOrientation
      });
    },
    select,
    deselect,
    end: () => selectionView.end()
  };
};
