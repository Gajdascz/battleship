import { STATES, ORIENTATIONS } from '../../../utility/constants/common';
import { publish } from './controllerPublishers';

export const handle = {
  eventBridge: null,
  placementState: {
    initiate: (model) => {
      model.setState(STATES.PLACEMENT);
      handle.eventBridge = (e) => handle.placementState.orientationToggled(e, model);
      document.addEventListener('mousedown', handle.eventBridge);
      document.addEventListener('keydown', handle.eventBridge);
    },
    selectShip: (view, model) => {
      publish.shipSelected(
        view.getElement(),
        model.getLength(),
        model.getID(),
        model.getOrientation()
      );
    },
    toggleOrientation: (e, model) => {
      const isRotateRequest = (e) =>
        e.code === 'Space' ||
        e.code === 'KeyR' ||
        e.button === 1 ||
        (e.target.classList.contains('rotate-ship-button') && e instanceof PointerEvent);
      if (!isRotateRequest(e)) return;
      e.preventDefault();
      model.setOrientation(
        model.getOrientation() === ORIENTATIONS.VERTICAL
          ? ORIENTATIONS.HORIZONTAL
          : ORIENTATIONS.VERTICAL
      );
      publish.orientationToggled(model.getID(), model.getOrientation());
    },
    placeShip: (e, model) => {
      model.setPlacedCoordinates(e.detail.coordinates);
      model.setIsPlaced(true);
      publish.placementSuccessful();
    }
  },
  progressState: {
    initiate: (model) => {
      model.setState(STATES.PROGRESS);
      document.removeEventListener('mousedown', handle.eventBridge);
      document.removeEventListener('keydown', handle.eventBridge);
      handle.eventBridge = null;
    },
    hitShip: (model) => publish.shipHit(model.getID()),
    sinkShip: (model) => publish.shipSunk(model.getID())
  }
};
