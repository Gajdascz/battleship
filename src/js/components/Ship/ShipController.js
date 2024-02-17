import { ShipModel } from './model/ShipModel';
import { ShipView } from './view/ShipView';
import { initializeStateCoordinator } from './utility/initializeStateCoordinator';
import { KEY_EVENTS } from '../../utility/constants/events';
import { STATUSES } from '../../utility/constants/common';
import { buildPublisher } from './utility/buildPublisher';
import { PUBLISHER_KEYS } from './utility/constants';

export const ShipController = (scope, { name, length }) => {
  const model = ShipModel(scope, { shipName: name, shipLength: length });
  const view = ShipView({ name, length });
  const publisher = buildPublisher(scope);
  const placementController = {
    toggleOrientation: (e) => {
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
    },
    selection: {
      request: () => {
        console.log('test');
        publisher.request(PUBLISHER_KEYS.REQUESTS.SELECTION, {
          id: model.getID(),
          rotateButton: view.elements.rotateButton
        });
      },
      select: () => {
        if (model.isPlaced()) placementController.placement.pickup();
        model.setIsSelected(true);
        view.update.selectedStatus(true);
        publisher.execute(PUBLISHER_KEYS.ACTIONS.SELECTED, {
          scope: model.getScope(),
          length: model.getLength(),
          orientation: model.getOrientation()
        });
        view.placement.enable();
      },
      deselect: () => {
        view.placement.disable();
        view.update.selectedStatus(false);
        model.setIsSelected(false);
      }
    },
    placement: {
      request: () =>
        publisher.request(PUBLISHER_KEYS.REQUESTS.PLACEMENT, {
          id: model.getScope(),
          length: model.getLength()
        }),
      place: (response) => {
        const { placedCoordinates } = response;
        placementController.selection.deselect();
        model.setPlacedCoordinates(placedCoordinates);
        model.setIsPlaced(true);
        view.update.placementStatus(true);
        publisher.execute(PUBLISHER_KEYS.ACTIONS.PLACEMENT_SET, { id: model.getScope() });
      },
      pickup: () => {
        model.clearPlacedCoordinates();
        model.setIsPlaced(false);
        view.update.placementStatus(false);
      }
    }
  };

  const combatController = {
    hit: () => {
      const result = model.hit();
      if (result === STATUSES.SHIP_SUNK) {
        view.updateSunkStatus(true);
        publisher.execute(PUBLISHER_KEYS.ACTIONS.HIT, { id: model.getScope() });
      }
    },
    handleAttack: ({ coordinates }) => {
      combatController.hit();
    }
  };

  const enablePlacementSettings = () => {
    view.selection.setSelectCallback(placementController.selection.request);
    view.selection.enable();
    view.placement.setPlaceCallback(placementController.placement.request);
    view.placement.setToggleOrientationCallback(placementController.toggleOrientation);
  };

  const enableCombatSettings = () => {
    view.selection.disable();
    view.placement.disable();
  };

  return {
    getScope: () => model.getScope(),
    getID: () => model.getID(),
    isSelected: () => model.isSelected(),
    getModel: () => model,
    getView: () => view,
    select: placementController.selection.select,
    deselect: placementController.selection.deselect,
    initializeStateManagement: () => {
      initializeStateCoordinator(model.getID(), model.getScope(), {
        enablePlacementSettings,
        handleAttack: combatController.handleAttack,
        setShipPlacement: placementController.placement.place
      });
    }
  };
};
