import { BoardView } from './BoardView';
import { BoardModel } from './BoardModel';
import { PLACEMENT_EVENTS } from '../../utility/constants/events';
import { generateComponentID } from '../../utility/utils/stringUtils';
import { StateCoordinator } from '../../utility/stateManagement/StateCoordinator';
import { mapShipQuadrants } from './utility/mapShipQuadrants';
import { buildPublisher } from './utility/buildPublisher';
import { PUBLISHER_KEYS } from './utility/constants';

export const BoardController = ({
  playerID,
  fleetController,
  mainGridController,
  trackingGridController
}) => {
  const id = generateComponentID({ scope: playerID, name: `board` });
  const stateCoordinator = StateCoordinator(id, playerID);
  const controllers = {
    fleet: fleetController,
    mainGrid: mainGridController,
    trackingGrid: trackingGridController
  };
  const view = BoardView(
    {
      mainGridView: controllers.mainGrid.getView(),
      trackingGridView: controllers.trackingGrid.getView(),
      fleetView: controllers.fleet.getView()
    },
    id
  );
  const model = BoardModel({
    mainGridModel: controllers.mainGrid.getModel(),
    trackingGridModel: controllers.trackingGrid.getModel(),
    fleetModel: controllers.fleet.getModel()
  });
  const quadrantMap = { current: null };
  const publisher = buildPublisher(playerID);

  view.displaySubmitPlacementsButton();
  const checkPlacementStatus = () => {
    if (model.isAllShipsPlaced()) view.enableSubmitPlacementsButton();
  };

  const handlePlacementFinalization = () => {
    const placements = model.getFleetPlacements();
    const placeAt = [];
    placements.forEach((placement) => {
      console.log(placement);
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
    attachTo: (container) => view.attachBoard(container),
    setTrackingFleet: (opponentTrackingFleet) => view.setTrackingFleet(opponentTrackingFleet),
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
