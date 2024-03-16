import { PlayerModel } from '../../Player/PlayerModel';
import { AIController } from '../../AI/AIController';
import { FleetController } from '../../Fleet/FleetController';
import { ShipController } from '../../Ship/ShipController';
import { MainGridController } from '../../Grids/MainGrid/MainGridController';
import { TrackingGridController } from '../../Grids/TrackingGrid/TrackingGridController';
import { PLAYERS } from '../../../Utility/constants/common';

const initializePlayerControllers = (fleetData, boardSettings) => ({
  fleet: FleetController(fleetData.map((ship) => ShipController(ship))),
  mainGrid: MainGridController(boardSettings),
  trackingGrid: TrackingGridController(boardSettings)
});

export const initializePlayer = ({ playerSettings, boardSettings, fleetData }) => {
  const player = { model: null, controllers: null };
  if (playerSettings.type === PLAYERS.TYPES.AI) {
    const { difficulty } = playerSettings;
    const aiController = AIController({ difficulty, boardSettings, fleetData });
    player.model = aiController.getPlayerModel();
    player.controllers = aiController;
  } else {
    const { username, id, type } = playerSettings;
    player.model = PlayerModel({ playerName: username, playerType: type, playerId: id });
    player.controllers = initializePlayerControllers(fleetData, boardSettings);
  }
  return player;
};
