import { ShipController } from '../../Ship/ShipController';
import { FleetController } from '../../Fleet/FleetController';
import { MainGridController } from '../../Grids/MainGrid/MainGridController';
import { TrackingGridController } from '../../Grids/TrackingGrid/TrackingGridController';
import { BoardController } from '../../Board/BoardController';
import { DEFAULT_FLEET } from '../../Fleet/common/fleetConstants';
import { PlayerModel } from '../../Player/PlayerModel';
import { GAME_MODES, PLAYERS } from '../../../Utility/constants/common';
import { AIController } from '../../AI/AIController';

const CLASSES = {
  GAME_CONTAINER: 'game-container'
};

export const initializeGame = ({
  p1Settings,
  p2Settings,
  boardSettings,
  shipData = DEFAULT_FLEET
}) => {
  const gameContainer = document.querySelector(`.${CLASSES.GAME_CONTAINER}`);

  const gameMode =
    p1Settings.type === PLAYERS.TYPES.HUMAN && p2Settings.type === PLAYERS.TYPES.AI
      ? GAME_MODES.HvA
      : GAME_MODES.HvH;
  const createPlayer = (playerSettings) => {
    if (playerSettings.type === PLAYERS.TYPES.AI) return initializeAIPlayer(playerSettings);
    else return initializeHumanPlayer(playerSettings);
  };
  const initializeHumanPlayer = (settings) => {
    const { username, id, type } = settings;
    return {
      model: PlayerModel({ playerName: username, playerType: type, playerID: id }),
      controllers: initializeControllers(username, id)
    };
  };
  const initializeAIPlayer = (settings) => {
    const { difficulty } = settings;
    const aiController = AIController({ difficulty, boardSettings, shipData });
    return {
      model: aiController.getPlayerModel(),
      controller: aiController
    };
  };

  const initializeControllers = (playerName, playerID) => {
    const scope = playerID;
    const initializeFleetController = () => {
      const controller = FleetController(scope);
      shipData.forEach((ship) => controller.assignShipToFleet(ShipController(scope, ship)));
      return controller;
    };
    const initializeGridControllers = () => ({
      mainGrid: MainGridController(scope, boardSettings),
      trackingGrid: TrackingGridController(scope, boardSettings)
    });

    const fleet = initializeFleetController();
    const { mainGrid, trackingGrid } = initializeGridControllers();
    const board = BoardController({
      playerID: scope,
      playerName,
      displayContainer: gameContainer,
      gameMode,
      controllers: { fleet, mainGrid, trackingGrid }
    });
    return { fleet, mainGrid, trackingGrid, board };
  };
  const initializeHvH = (p1, p2) => {
    p1.controllers.board.view.initialize(
      p2.model.getName(),
      p2.controllers.fleet.view.getTrackingFleet()
    );
    p2.controllers.board.view.initialize(
      p1.model.getName(),
      p1.controllers.fleet.view.getTrackingFleet()
    );
  };

  const initializeHvA = (p1, p2) => {
    console.log(p1, p2);
    p1.controllers.board.view.initialize(
      p2.controller.view.getTrackingGrid(),
      p2.controller.view.getTrackingFleet()
    );
  };

  const p1 = createPlayer(p1Settings);
  const p2 = createPlayer(p2Settings);

  if (gameMode === GAME_MODES.HvA) initializeHvA(p1, p2);
  else initializeHvH(p1, p2);

  return { p1, p2 };
};
