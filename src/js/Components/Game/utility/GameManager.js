import { ShipController } from '../../Ship/ShipController';
import { FleetController } from '../../Fleet/FleetController';
import { MainGridController } from '../../Grids/MainGrid/MainGridController';
import { TrackingGridController } from '../../Grids/TrackingGrid/TrackingGridController';
import { BoardController } from '../../Board/BoardController';
import { DEFAULT_FLEET } from '../../Fleet/common/fleetConstants';
import { PlayerModel } from '../../Player/PlayerModel';
import { GAME_MODES, PLAYERS } from '../../../Utility/constants/common';
import { AIController } from '../../AI/AIController';
import { createEventKeyGenerator } from '../../../Utility/utils/createEventKeyGenerator';
const CLASSES = {
  GAME_CONTAINER: 'game-container'
};
const gameContainer = document.querySelector(`.${CLASSES.GAME_CONTAINER}`);

const createPlayer = (playerSettings, boardSettings, shipData, gameMode) => {
  const getEmitterBundles = (emitter, p1Id, p2Id) => {
    const p1KeyGenerator = createEventKeyGenerator(p1Id);
    const p2KeyGenerator = createEventKeyGenerator(p2Id);
    return {
      [p1Id]: { emitter, getPlayerKey: p1KeyGenerator, getOpponentKey: p2KeyGenerator },
      [p2Id]: { emitter, getPlayerKey: p2KeyGenerator, getOpponentKey: p1KeyGenerator }
    };
  };
  const initializeHumanPlayer = (settings) => {
    const { username, id, type } = settings;
    const playerModel = PlayerModel({ playerName: username, playerType: type, playerId: id });
    return initializeControllers(playerModel.getName(), playerModel.getId()).board;
  };
  const initializeAIPlayer = (settings) => {
    const { difficulty } = settings;
    return AIController({ difficulty, boardSettings, shipData }).board;
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

const initializeHvAView = (human, ai) => {
  human.view.initialize(ai.provideTrackingGrid(), ai.provideTrackingFleet());
};

const initializeHvHView = (p1, p2) => {
  p1.view.initialize(p2.getPlayerName(), p2.provideTrackingFleet());
  p2.view.initialize(p1.getPlayerName(), p1.provideTrackingFleet());
};

const initializeView = (players, gameMode) => {
  const { p1, p2 } = players;
  if (gameMode === GAME_MODES.HvA) initializeHvAView(p1, p2);
  else initializeHvHView(p1, p2);
};

export const GameManager = ({
  p1Settings,
  p2Settings,
  boardSettings,
  shipData = DEFAULT_FLEET,
  emitter
}) => {
  const gameMode =
    p1Settings.type === PLAYERS.TYPES.HUMAN && p2Settings.type === PLAYERS.TYPES.AI
      ? GAME_MODES.HvA
      : GAME_MODES.HvH;

  const playerControllers = {
    p1: createPlayer(p1Settings, boardSettings, shipData, gameMode, emitter),
    p2: createPlayer(p2Settings, boardSettings, shipData, gameMode, emitter)
  };
  initializeView(playerControllers, gameMode);

  const players = { current: playerControllers.p1, waiting: playerControllers.p2 };
  const alternatePlayers = () => {
    [players.current, players.waiting] = [players.waiting, players.current];
  };

  const placement = {
    getCurrent: () => players.current.placement,
    isOver: () => Object.values(players).every((player) => player.placement.isOver()),
    startCurrent: () => placement.getCurrent().startTurn(),
    addOnEndToCurrent: (callback) => placement.getCurrent().onEnd(callback)
  };

  return {
    players,
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
