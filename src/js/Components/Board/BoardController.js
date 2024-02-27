import { BoardView } from './view/BoardView';
import { BoardModel } from './model/BoardModel';
import { StateCoordinator } from '../../State/StateCoordinator';
import { mapShipQuadrants } from './utility/mapShipQuadrants';
import { MAIN_GRID_EVENTS } from '../Grids/MainGrid/utility/mainGridEvents';
import { SHIP_EVENTS } from '../Ship/events/shipEvents';
import { EventManager } from '../../Events/management/EventManager';
export const BoardController = ({
  playerID,
  playerName,
  fleetController,
  mainGridController,
  trackingGridController
}) => {
  const controllers = {
    fleet: fleetController,
    mainGrid: mainGridController,
    trackingGrid: trackingGridController
  };
  const model = BoardModel(playerID, {
    mainGridModel: controllers.mainGrid.getModel(),
    trackingGridModel: controllers.trackingGrid.getModel(),
    fleetModel: controllers.fleet.getModel()
  });
  const stateCoordinator = StateCoordinator(model.getScopedID(), model.getScope());

  const view = BoardView(model.getScopedID(), playerName, {
    mainGridView: controllers.mainGrid.getView(),
    trackingGridView: controllers.trackingGrid.getView(),
    fleetView: controllers.fleet.getView()
  });
  const { publisher, subscriptionManager, componentEmitter } = EventManager(model.getScope());

  const quadrantMap = { current: null };

  const placementController = {
    initialize: () => {
      view.buttons.submitPlacements.init();
      view.trackingGrid.disable();
      view.trackingGrid.hide();
      subscriptionManager.normal.scoped.subscribe(
        SHIP_EVENTS.PLACEMENT.SET,
        placementController.shipPlaced
      );
    },
    shipSelected: ({ data }) => {
      publisher.scoped.noFulfill(MAIN_GRID_EVENTS.PLACEMENT.TOGGLE_PLACEMENT_SUBMISSION_REQUEST, {
        isReady: false
      });
      view.buttons.rotateShip.update(data.scopedID);
    },
    shipPlaced: () => {
      publisher.scoped.noFulfill(MAIN_GRID_EVENTS.PLACEMENT.TOGGLE_PLACEMENT_SUBMISSION_REQUEST, {
        isReady: model.isAllShipsPlaced()
      });
    },
    placementFinalized: () => {
      const placements = model.getFleetPlacements();
      const placeAt = [];
      placements.forEach((placement) => {
        placeAt.push({
          start: placement.internal[0],
          end: placement.internal[placement.internal.length - 1]
        });
      });
      const { width, height } = controllers.mainGrid.getDimensions();
      quadrantMap.current = mapShipQuadrants(placements, width, height);
      console.log(placeAt);
      publisher.scoped.noFulfill(MAIN_GRID_EVENTS.PLACEMENT.FINALIZATION_REQUESTED, { placeAt });
    }
  };

  return {
    getBoardElement: () => view.getBoardElement(),
    setTrackingFleet: (opponentTrackingFleet) => view.setTrackingFleet(opponentTrackingFleet),
    isAllShipsPlaced: () => model.isAllShipsPlaced(),
    getView: () => view,
    initializeStateManagement: () => {
      stateCoordinator.placement.addExecute(placementController.initialize);
      stateCoordinator.placement.addSubscribe(
        SHIP_EVENTS.SELECTION.SELECTED,
        placementController.shipSelected
      );
      stateCoordinator.initializeManager();
    }
  };
};
