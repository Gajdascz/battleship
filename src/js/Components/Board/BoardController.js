import { BoardView } from './view/BoardView';
import { BoardModel } from './model/BoardModel';
import { StateCoordinator } from '../../State/StateCoordinator';
import { mapShipQuadrants } from './utility/mapShipQuadrants';
import { buildPublisher, PUBLISHER_KEYS } from './utility/buildPublisher';

import { MAIN_GRID_EVENTS } from '../Grids/MainGrid/utility/mainGridEvents';
import { SHIP_EVENTS } from '../Ship/events/shipEvents';

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

  const quadrantMap = { current: null };
  const publisher = buildPublisher(model.getScope());

  const checkPlacementStatus = () => {
    if (model.isAllShipsPlaced()) view.buttons.submitPlacements.enable();
  };

  const placementController = {
    initialize: () => {
      view.buttons.submitPlacements.init();
      view.trackingGrid.disable();
      view.trackingGrid.hide();
    },
    shipSelected: ({ data }) => {
      view.buttons.submitPlacements.disable();
      view.buttons.rotateShip.update(data.scopedID);
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
      controllers.mainGrid.finalizePlacements(placeAt);
      const { width, height } = controllers.mainGrid.getDimensions();
      quadrantMap.current = mapShipQuadrants(placements, width, height);
      publisher.execute(PUBLISHER_KEYS.ACTIONS.PLACEMENTS_FINALIZED, { playerID });
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
      stateCoordinator.placement.addSubscribe(SHIP_EVENTS.PLACEMENT.SET, checkPlacementStatus);
      stateCoordinator.placement.addSubscribe(
        MAIN_GRID_EVENTS.PLACEMENT.FINALIZATION_REQUESTED,
        placementController.placementFinalized
      );
      stateCoordinator.initializeManager();
    }
  };
};
