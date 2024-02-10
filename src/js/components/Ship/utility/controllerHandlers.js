import { SHIP } from '../../../___ui/common/constants/shipConstants';
import { publish } from './controllerPublishers';

export const handle = {
  eventBridge: null,
  placementState: {
    initiate: (model) => {
      model.setState(SHIP.STATES.PLACEMENT);
      handle.eventBridge = (e) => handle.placementState.orientationToggled(e, model);
      document.addEventListener('mousedown', handle.eventBridge);
      document.addEventListener('keydown', handle.eventBridge);
    },
    shipSelected: (view, model) => {
      publish.shipSelected(
        view.getElement(),
        model.getLength(),
        model.getID(),
        model.getOrientation()
      );
    },
    orientationToggled: (e, model) => {
      const isRotateRequest = (e) =>
        e.code === 'Space' ||
        e.code === 'KeyR' ||
        e.button === 1 ||
        (e.target.classList.contains('rotate-ship-button') && e instanceof PointerEvent);
      if (!isRotateRequest(e)) return;
      e.preventDefault();
      model.setOrientation(
        model.getOrientation() === SHIP.ORIENTATIONS.VERTICAL
          ? SHIP.ORIENTATIONS.HORIZONTAL
          : SHIP.ORIENTATIONS.VERTICAL
      );
      publish.orientationToggled(model.getID(), model.getOrientation());
    },
    shipPlaced: (e, model) => {
      model.setPlacedCoordinates(e.detail.coordinates);
      model.setIsPlaced(true);
      publish.placementSuccessful();
    }
  },
  progressState: {
    initiate: (model) => {
      model.setState(SHIP.STATES.PROGRESS);
      document.removeEventListener('mousedown', handle.eventBridge);
      document.removeEventListener('keydown', handle.eventBridge);
      handle.eventBridge = null;
    },

    shipHit: (model) => publish.shipHit(model.getID()),
    shipSunk: (model) => publish.shipSunk(model.getID())
  }
};
