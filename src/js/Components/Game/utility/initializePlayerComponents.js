import { PlayerModel } from '../../Player/PlayerModel';
import { ShipController } from '../../Ship/ShipController';
import { FleetController } from '../../Fleet/FleetController';
import { MainGridController } from '../../Grids/MainGrid/MainGridController';
import { TrackingGridController } from '../../Grids/TrackingGrid/TrackingGridController';
import { BoardController } from '../../Board/BoardController';
import { DEFAULT_FLEET } from '../../Fleet/common/fleetConstants';
import { PLAYERS } from '../../../Utility/constants/common';
import { AIController } from '../../AI/AIController';

export const initializePlayerComponents = ({ playerModel, boardSettings, gameMode, shipData }) => {
  console.log(playerModel);
  const scope = playerModel.getID();
  const fleetController = FleetController(scope);
  shipData.forEach((ship) => {
    const shipController = ShipController(scope, ship);
    fleetController.assignShipToFleet(shipController);
  });
  const mainGridController = MainGridController(scope, boardSettings);
  const trackingGridController = TrackingGridController(scope, boardSettings);
  const boardController = BoardController({
    playerID: playerModel.getID(),
    playerName: playerModel.getName(),
    fleetController,
    mainGridController,
    trackingGridController,
    gameMode
  });
  const controllers = {
    board: boardController,
    fleet: fleetController,
    mainGrid: mainGridController,
    trackingGrid: trackingGridController
  };

  Object.values(controllers).forEach((controller) => controller.initializeStateManagement());
  return { getID: () => playerModel.getID(), playerModel, controllers };
};
