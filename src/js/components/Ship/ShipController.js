import { ShipModel } from './model/ShipModel';
import { ShipView } from './view/ShipView';
import { KEY_EVENTS, PROGRESS_EVENTS, PLACEMENT_EVENTS } from '../../utility/constants/events';
import { STATUSES } from '../../utility/constants/common';
import { buildPublisher, PUBLISHER_KEYS } from './utility/buildPublisher';
import { StateCoordinator } from '../../utility/stateManagement/StateCoordinator';
import { convertToInternalFormat } from '../../utility/utils/coordinatesUtils';

export const ShipController = (scope, { name, length }) => {
  const model = ShipModel(scope, { shipName: name, shipLength: length });
  const view = ShipView({ name, length });
  const publisher = buildPublisher(scope);
  const stateCoordinator = StateCoordinator(model.getScopedID(), model.getScope());

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
        publisher.request(PUBLISHER_KEYS.REQUESTS.SELECTION, {
          scopedID: model.getScopedID(),
          rotateButton: view.elements.rotateButton
        });
      },
      select: () => {
        if (model.isPlaced()) placementController.placement.pickup();
        model.setIsSelected(true);
        view.update.selectedStatus(true);
        publisher.execute(PUBLISHER_KEYS.ACTIONS.SELECTED, {
          id: model.getID(),
          scopedID: model.getScopedID(),
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
        publisher.execute(PUBLISHER_KEYS.ACTIONS.DESELECTED, {
          scopedID: model.getScopedID()
        });
      }
    },
    placement: {
      request: () =>
        publisher.request(PUBLISHER_KEYS.REQUESTS.PLACEMENT, {
          id: model.getID(),
          scopedID: model.getScopedID(),
          length: model.getLength()
        }),
      place: ({ data }) => {
        const { placedCoordinates } = data;
        placementController.selection.deselect();
        const internal = placedCoordinates.map((coordinates) =>
          convertToInternalFormat(coordinates)
        );
        model.setPlacedCoordinates({ internal, display: placedCoordinates });
        model.setIsPlaced(true);
        view.update.placementStatus(true);
        publisher.execute(PUBLISHER_KEYS.ACTIONS.PLACEMENT_SET, { scopedID: model.getScopedID() });
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
    getScopedID: () => model.getScopedID(),
    isSelected: () => model.isSelected(),
    getModel: () => model,
    getView: () => view,
    select: placementController.selection.select,
    deselect: placementController.selection.deselect,
    initializeStateManagement: () => {
      // placement
      stateCoordinator.placement.addExecute(enablePlacementSettings);
      stateCoordinator.placement.addDynamic({
        event: PLACEMENT_EVENTS.GRID_PLACEMENT_PROCESSED,
        callback: placementController.placement.place,
        subscribeTrigger: PLACEMENT_EVENTS.SHIP_SELECTED,
        unsubscribeTrigger: PLACEMENT_EVENTS.SHIP_DESELECTED,
        id: model.getScopedID()
      });
      // progress
      stateCoordinator.progress.addExecute(enableCombatSettings);
      stateCoordinator.progress.addSubscribe(
        PROGRESS_EVENTS.ATTACK_INITIATED,
        combatController.handleAttack
      );
      stateCoordinator.initializeManager();
    }
  };
};
