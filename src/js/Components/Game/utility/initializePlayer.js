import { PlayerModel } from '../../Player/PlayerModel';
import { AIController } from '../../AI/AIController';
import { FleetController } from '../../Fleet/FleetController';
import { ShipController } from '../../Ship/ShipController';
import { MainGridController } from '../../Grids/MainGrid/MainGridController';
import { TrackingGridController } from '../../Grids/TrackingGrid/TrackingGridController';
import { PLAYERS } from '../../../Utility/constants/common';

/**
 * Initializes a player's game component controllers.
 *
 * @param {array[Object]} fleetData Array of ship detail objects {id,length}.
 * @param {Object} boardSettings Contains board settings and grid configurations.
 * @returns {Object} Object containing configured controllers.
 */
const initializePlayerControllers = (fleetData, boardSettings) => ({
  fleet: FleetController(fleetData.map((ship) => ShipController(ship))),
  mainGrid: MainGridController(boardSettings),
  trackingGrid: TrackingGridController(boardSettings)
});

/**
 * Configures and initializes a player for the game.
 * Creates the necessary models and controllers based on player type.
 *
 * @param {Object} detail Contains player settings, board configurations, and fleet data.
 * @param {Object} detail.playerSettings Settings specific to the player including type, id, and additional AI settings.
 * @param {Object} detail.boardSettings The board configuration including size and other relevant settings.
 * @param {array[Object]} detail.fleetData Information about the player's fleet including ship lengths and identifiers.
 * @returns {Object} An object containing the player's model and controllers for game interaction.
 */
export const initializePlayer = ({ playerSettings, boardSettings, fleetData }) => {
  const player = { model: null, controllers: null };
  if (playerSettings.type === PLAYERS.TYPES.AI) {
    const { id, difficulty, attackDelay } = playerSettings;
    const aiController = AIController({ id, difficulty, boardSettings, fleetData, attackDelay });
    player.model = aiController.getPlayerModel();
    player.controllers = aiController;
  } else {
    const { username, id, type } = playerSettings;
    player.model = PlayerModel({ playerName: username, playerType: type, playerId: id });
    player.controllers = initializePlayerControllers(fleetData, boardSettings);
  }
  return player;
};
