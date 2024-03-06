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
      playerID: scope,
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
  const { current: p1, waiting: p2 } = players;
  if (gameMode === GAME_MODES.HvA) {
    p1.controllers.board.view.initialize(
      p2.controllers.view.getTrackingGrid(),
      p2.controllers.view.getTrackingFleet()
    );
  } else {
    p1.controllers.board.view.initialize(
      p2.model.getName(),
      p2.controllers.view.getTrackingFleet()
    );
    p2.controllers.board.view.initialize(
      p1.model.getName(),
      p1.controllers.view.getTrackingFleet()
    );
  }
};

const initializeCombat = (p1, p2, gameMode) => {
  if (gameMode === GAME_MODES.HvA) {
    const p1CombatController = p1.controllers.board.combat;
    const p2CombatController = p2.controllers.board.combat;
    p1CombatController.initialize({
      opponentOnAttackSent: p2CombatController.onAttackSent,
      opponentProcessIncomingAttack: p2CombatController.processIncomingAttack,
      opponentOnIncomingAttackProcessed: p2CombatController.onIncomingAttackProcessed,
      opponentProcessSentAttackResult: p2CombatController.processSentAttackResult
    });
    p2CombatController.initialize({
      opponentOnAttackSent: p1.controllers.trackingGrid.combat.onAttackSent,
      opponentProcessIncomingAttack: p1.controllers.mainGrid.combat.processIncomingAttack,
      opponentOnIncomingAttackProcessed: p1.controllers.mainGrid.combat.onIncomingAttackProcessed,
      opponentProcessSentAttackResult: p1.controller.trackingGrid.combat.processSentAttackResult
    });
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
  const players = {
    current: createPlayer(p1Settings, boardSettings, shipData, gameMode),
    waiting: createPlayer(p2Settings, boardSettings, shipData, gameMode)
  };
  initializeView(players, gameMode);

  const alternatePlayers = () =>
    ([players.current, players.waiting] = [players.waiting, players.current]);

  initializeCombat(players.current, players.waiting, gameMode);
  return {
    alternatePlayers,
    getCurrentPlacementController: () => players.current.controllers.board.placement,
    getCurrentCombatController: () => players.current.controllers.board.combat,
    getNumberOfPlayers: () => Object.values(players).length
  };
};
