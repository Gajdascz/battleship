import { BoardView } from './BoardView';
import { BoardModel } from './BoardModel';
import { PLACEMENT_EVENTS } from '../../utility/constants/events';
import { StateCoordinator } from '../../utility/stateManagement/StateCoordinator';
import { mapShipQuadrants } from './utility/mapShipQuadrants';
import { buildPublisher } from './utility/buildPublisher';

export const BoardController = ({
  playerID,
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

  const view = BoardView(model.getScopedID(), {
    mainGridView: controllers.mainGrid.getView(),
    trackingGridView: controllers.trackingGrid.getView(),
    fleetView: controllers.fleet.getView()
  });

  const quadrantMap = { current: null };
  const publisher = buildPublisher(model.getScope());

  view.displaySubmitPlacementsButton();
  const checkPlacementStatus = () => {
    if (model.isAllShipsPlaced()) view.enableSubmitPlacementsButton();
  };

  const handlePlacementFinalization = () => {
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
    publisher.execute(publisher.keys.ACTIONS.PLACEMENTS_FINALIZED, { playerID });
  };

  return {
    attachTo: (container) => view.attachBoard(container),
    setTrackingFleet: (opponentTrackingFleet) => view.setTrackingFleet(opponentTrackingFleet),
    isAllShipsPlaced: () => model.isAllShipsPlaced(),
    initializeStateManagement: () => {
      stateCoordinator.placement.addExecute(view.hideTrackingGrid);
      stateCoordinator.placement.addSubscribe(
        PLACEMENT_EVENTS.SHIP_SELECTED,
        view.disableSubmitPlacementsButton
      );
      stateCoordinator.placement.addSubscribe(
        PLACEMENT_EVENTS.SHIP_PLACEMENT_SET,
        checkPlacementStatus
      );
      stateCoordinator.placement.addSubscribe(
        PLACEMENT_EVENTS.GRID_PLACEMENTS_FINALIZATION_REQUESTED,
        handlePlacementFinalization
      );
      stateCoordinator.initializeManager();
    }
  };
};
