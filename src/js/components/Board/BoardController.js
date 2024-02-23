import { BoardView } from './view/BoardView';
import { BoardModel } from './model/BoardModel';
import { PLACEMENT_EVENTS } from '../../utility/constants/events';
import { StateCoordinator } from '../../utility/stateManagement/StateCoordinator';
import { mapShipQuadrants } from './utility/mapShipQuadrants';
import { buildPublisher, PUBLISHER_KEYS } from './utility/buildPublisher';

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

  const checkPlacementStatus = () => {
    if (model.isAllShipsPlaced()) view.buttons.submitPlacements.enable();
  };

  const initializePlacementState = () => {
    view.buttons.submitPlacements.init();
  };
  const handleShipSelected = ({ data }) => {
    view.buttons.submitPlacements.disable();
    view.buttons.rotateShip.update(data.scopedID);
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
    publisher.execute(PUBLISHER_KEYS.ACTIONS.PLACEMENTS_FINALIZED, { playerID });
  };

  return {
    getBoardElement: () => view.getBoardElement(),
    setTrackingFleet: (opponentTrackingFleet) => view.setTrackingFleet(opponentTrackingFleet),
    isAllShipsPlaced: () => model.isAllShipsPlaced(),
    getView: () => view,
    initializeStateManagement: () => {
      stateCoordinator.placement.addExecute(initializePlacementState);
      stateCoordinator.placement.addSubscribe(PLACEMENT_EVENTS.SHIP_SELECTED, handleShipSelected);
      stateCoordinator.placement.addSubscribe(
        PLACEMENT_EVENTS.SHIP_PLACEMENT_SET,
        checkPlacementStatus
      );
      stateCoordinator.placement.addSubscribe(
        PLACEMENT_EVENTS.GRID_PLACEMENTS_FINALIZATION_REQUESTED,
        handlePlacementFinalization
      );
      // stateCoordinator.progress.addExecute(view.trackingGrid.display());
      stateCoordinator.initializeManager();
    }
  };
};
