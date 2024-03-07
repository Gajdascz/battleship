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
const gameContainer = document.querySelector(`.${CLASSES.GAME_CONTAINER}`);

const createPlayer = (playerSettings, boardSettings, shipData, gameMode) => {
  const initializeHumanPlayer = (settings) => {
    const { username, id, type } = settings;
    const playerModel = PlayerModel({ playerName: username, playerType: type, playerId: id });
    return {
      model: playerModel,
      controllers: initializeControllers(playerModel.getName(), playerModel.getId())
    };
  };
  const initializeAIPlayer = (settings) => {
    const { difficulty } = settings;
    const aiController = AIController({ difficulty, boardSettings, shipData });
    return {
      model: aiController.getPlayerModel(),
      controllers: aiController
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
      playerId: scope,
      playerName,
      displayContainer: gameContainer,
      gameMode,
      controllers: { fleet, mainGrid, trackingGrid }
    });
    return { fleet, mainGrid, trackingGrid, board };
  };
  if (playerSettings.type === PLAYERS.TYPES.AI) return initializeAIPlayer(playerSettings);
  else return initializeHumanPlayer(playerSettings);
};

const initializeView = (players, gameMode) => {
  const { p1, p2 } = players;
  if (gameMode === GAME_MODES.HvA) {
    p1.controllers.board.view.initialize(
      p2.controllers.view.getTrackingGrid(),
      p2.controllers.view.getTrackingFleet()
    );
  } else {
    console.log(p2.model.getName());
    p1.controllers.board.view.initialize(
      p2.model.getName(),
      p2.controllers.fleet.view.getTrackingFleet()
    );
    p2.controllers.board.view.initialize(
      p1.model.getName(),
      p1.controllers.fleet.view.getTrackingFleet()
    );
  }
};

export const GameManager = ({
  p1Settings,
  p2Settings,
  boardSettings,
  shipData = DEFAULT_FLEET
}) => {
  const gameMode =
    p1Settings.type === PLAYERS.TYPES.HUMAN && p2Settings.type === PLAYERS.TYPES.AI
      ? GAME_MODES.HvA
      : GAME_MODES.HvH;
  const playersMain = {
    p1: createPlayer(p1Settings, boardSettings, shipData, gameMode),
    p2: createPlayer(p2Settings, boardSettings, shipData, gameMode)
  };
  const players = {
    current: playersMain.p1.controllers.board,
    waiting: playersMain.p2.controllers.board
  };

  initializeView(playersMain, gameMode);

  const alternatePlayers = () =>
    ([players.current, players.waiting] = [players.waiting, players.current]);

  const placement = {
    getCurrent: () => players.current.placement,
    isOver: () => Object.values(players).every((player) => player.placement.isOver()),
    startCurrent: () => placement.getCurrent().startTurn(),
    addOnEndToCurrent: (callback) => placement.getCurrent().onEnd(callback)
  };

  return {
    alternatePlayers,
    placement: {
      isOver: () => placement.isOver(),
      startCurrent: () => placement.startCurrent(),
      addOnEndToCurrent: (callback) => placement.addOnEndToCurrent(callback)
    },
    getCurrentPlayerId: () => players.current.model.getId(),
    getCurrentPlacementController: () => players.current.controllers.board.placement,
    getCurrentCombatController: () => players.current.controllers.board.combat
  };
};
