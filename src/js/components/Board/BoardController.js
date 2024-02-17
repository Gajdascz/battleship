import { BoardView } from './BoardView';
import { BoardModel } from './BoardModel';
import eventEmitter from '../../utility/events/eventEmitter';
import { PLACEMENT_EVENTS } from '../../utility/constants/events';
import { generateComponentID } from '../../utility/utils/stringUtils';
import { StateCoordinator } from '../../utility/stateManagement/StateCoordinator';
// const handlePlacementSubmission = () => {
//   const placements = new Map();
//   _model.getFleet().forEach((ship) => {
//     const startCoordinates = convertToInternalFormat(ship.placedCoordinates[0]);
//     const endCoordinates = convertToInternalFormat(
//       ship.placedCoordinates[ship.placedCoordinates.length - 1]
//     );
//     placements.set(ship.id, { start: startCoordinates, end: endCoordinates });
//   });
//   dispatch.submitPlacements(placements);
// };

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
  view.displaySubmitPlacementsButton();
  const checkPlacementStatus = () => {
    if (model.isAllShipsPlaced()) view.enableSubmitPlacementsButton();
  };

  return {
    attachTo: (container) => view.attachBoard(container),
    setTrackingFleet: (opponentTrackingFleet) => view.setTrackingFleet(opponentTrackingFleet),
    initializeStateManagement: () => {
      stateCoordinator.placement.addExecute(view.hideTrackingGrid);
      console.log(view.disableSubmitPlacementsButton);
      stateCoordinator.placement.addSubscribe(
        PLACEMENT_EVENTS.SHIP_SELECTED,
        view.disableSubmitPlacementsButton
      );
      stateCoordinator.placement.addSubscribe(
        PLACEMENT_EVENTS.SHIP_PLACEMENT_SET,
        checkPlacementStatus
      );
      stateCoordinator.initializeManager();
    }
  };
};
