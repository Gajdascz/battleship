import { PlayerModel } from '../../Player/PlayerModel';
import { ShipController } from '../../Ship/ShipController';
import { FleetController } from '../../Fleet/FleetController';
import { MainGridController } from '../../Grids/MainGrid/MainGridController';
import { TrackingGridController } from '../../Grids/TrackingGrid/TrackingGridController';
import { BoardController } from '../../Board/BoardController';
import { DEFAULT_FLEET } from '../../../utility/constants/components/fleet';
import { PLAYERS } from '../../../utility/constants/common';
import { AIController } from '../../AI/AIController';

const initializeAIController = ({ difficulty, boardSettings, shipData }) =>
  AIController({ difficulty, shipData, boardSettings });

export const initializePlayerComponents = ({ playerSettings, boardSettings }) => {
  const shipData = DEFAULT_FLEET;
  const { username, type, difficulty, id } = playerSettings;
  if (type === PLAYERS.TYPES.AI)
    return initializeAIController({ difficulty, boardSettings, shipData });
  const playerModel = PlayerModel({ playerName: username, playerType: type, playerID: id });

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
    trackingGridController
  });
  const controllers = {
    board: boardController,
    fleet: fleetController,
    mainGrid: mainGridController,
    trackingGrid: trackingGridController
  };

  Object.values(controllers).forEach((controller) => controller.initializeStateManagement());
  return { playerModel, controllers };
};
