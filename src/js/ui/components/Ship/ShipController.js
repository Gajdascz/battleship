import { dispatch } from './utility/shipControllerDispatch';
import { SHIP } from '../../common/constants/shipConstants';

export const ShipController = (shipModel, shipView) => {
  const updateView = () => shipView.render(shipModel);
  const select = () => {
    if (!(shipModel.getState() === SHIP.STATES.PLACEMENT)) return;
    if (shipModel.isSelected()) pickup();
    shipModel.setIsSelected(true);
    eventFunctions.shipSelected();
    updateView();
  };
  const deselect = () => {
    if (!(shipModel.getState() === SHIP.STATES.PLACEMENT)) return;
    shipModel.setIsSelected(false);
    updateView();
  };
  const pickup = () => {
    shipModel.setPlacedCoordinates([]);
    shipModel.setIsPlaced(false);
    updateView();
  };

  const setToPlacementState = () => {
    if (shipModel.isPlacementState()) return;
    shipModel.setState(SHIP.STATES.PLACEMENT);
    document.addEventListener('mousedown', eventFunctions.orientationToggled);
    document.addEventListener('keydown', eventFunctions.orientationToggled);
    updateView();
  };
  const setToProgressState = () => {
    if (shipModel.isProgressState()) return;
    shipModel.setState(SHIP.STATES.PROGRESS);
    shipView.updateForProgressState();
    eventFunctions.setToProgressState();
    document.removeEventListener('mousedown', eventFunctions.orientationToggled);
    document.removeEventListener('keydown', eventFunctions.orientationToggled);
    updateView();
  };
  const hitShip = () => {
    if (!shipModel.isProgressState()) return;
    const result = shipModel.hit();
    if (result === -1) shipSunk();
    else eventFunctions.shipHit();
    updateView();
  };
  const shipSunk = () => {
    if (!shipModel.isProgressState()) return;
    eventFunctions.shipSunk();
    shipView.updateSunkStatus(shipModel.isSunk());
    updateView();
  };

  // Abstract and refactor into utility module
  const eventFunctions = {
    shipSelected: () => {
      dispatch.shipSelected(shipView.getElement(), shipModel.getID(), shipModel.getOrientation());
    },
    orientationToggled: (e) => {
      const isRotateRequest = (e) =>
        e.code === 'Space' ||
        e.code === 'KeyR' ||
        e.button === 1 ||
        (e.target.classList.contains('rotate-ship-button') && e instanceof PointerEvent);
      if (!isRotateRequest(e)) return;
      e.preventDefault();
      shipModel.setOrientation(
        shipModel.getOrientation() === SHIP.ORIENTATIONS.VERTICAL
          ? SHIP.ORIENTATIONS.HORIZONTAL
          : SHIP.ORIENTATIONS.VERTICAL
      );
      dispatch.orientationToggled(shipModel.getID(), shipModel.getOrientation());
    },
    shipPlaced: (e) => {
      deselect();
      shipModel.setPlacedCoordinates(e.detail.coordinates);
      shipModel.setIsPlaced(true);
      dispatch.placementSuccessful();
    },
    shipHit: () => dispatch.shipHit(shipModel.getID()),
    shipSunk: () => dispatch.shipSunk(shipModel.getID())
  };

  // const handlerData = {
  //   placementState: {
  //     selected: {
  //       key: 'selected',
  //       attachToElement: true,
  //       triggerFunctionObj: { click: [handlerFunctions.shipSelected] }
  //     },
  //     orientationToggled: {
  //       key: 'orientationToggled',
  //       attachToElement: false,
  //       triggerFunctionObj: {
  //         mouseDown: [handlerFunctions.orientationToggled],
  //         keyDown: [handlerFunctions.orientationToggled]
  //       }
  //     },
  //     placed: {
  //       key: 'placed',
  //       attachToElement: false,
  //       triggerFunctionObj: { [SHIP.EVENTS.PLACED]: [handlerFunctions.shipPlaced] }
  //     }
  //   }
  // };

  return {
    setToPlacementState,
    select,
    deselect,
    setToProgressState,
    hitShip
  };
};
