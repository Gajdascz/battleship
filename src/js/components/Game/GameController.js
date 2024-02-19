import { PlayerModel } from '../Player/PlayerModel';
import { FleetController } from '../Fleet/FleetController';
import { ShipController } from '../Ship/ShipController';
import { BoardController } from '../Board/BoardController';
import { GameModel } from './GameModel';
import { GameView } from './GameView';
import { MainGridController } from '../Grids/MainGrid/MainGridController';
import { TrackingGridController } from '../Grids/TrackingGrid/TrackingGridController';
import { GameStateController } from './GameStateController';
export const GameController = () => {
  const GAME_CONTAINER = document.querySelector('.game-container');
  const model = GameModel();
  const view = GameView();
  const transition = { fn: null };

  const stateController = GameStateController();

  const initializePlayerComponents = ({ playerData, gridConfig, shipData }) => {
    const playerModel = PlayerModel(playerData);
    const scope = playerModel.getID();
    const fleetController = FleetController(scope);
    const mainGridController = MainGridController(scope, gridConfig);
    const trackingGridController = TrackingGridController(scope, gridConfig);
    shipData.forEach((ship) => {
      const shipController = ShipController(scope, ship);
      fleetController.assignShipToFleet(shipController);
    });
    fleetController.setShipPlacementContainer(mainGridController.getView().elements.grid);

    const boardController = BoardController({
      playerID: playerModel.getID(),
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

    initializeControllerStates(controllers);
    return { playerModel, controllers };
  };

  const initializeControllerStates = (controllers) => {
    Object.values(controllers).forEach((controller) => controller.initializeStateManagement());
  };

  const startGame = ({ p1Data, p2 }) => {
    const p1 = initializePlayerComponents(p1Data);
    model.setP1({ playerModel: p1.playerModel, boardController: p1.controllers.board });
    stateController.initialize();
    stateController.transition();
    stateController.transition();
    startPlacementState();
  };

  const displayCurrentPlayer = () => {
    const currentPlayer = model.getCurrentPlayer();
    const board = currentPlayer.board;
    board.attachTo(GAME_CONTAINER);
  };

  const startPlacementState = () => {
    displayCurrentPlayer();
  };

  const switchCurrentPlayer = () => {};

  return { startGame };
};

// const p2Model = PlayerModel(p2Data.playerData);
// const p2Controllers = initializeControllers(p2Data.gridConfig);
// initializeFleet({ fleetController: p2Controllers.fleet });
// const p2Board = BoardController({
//   playerID: p2Model.getID(),
//   fleetController: p2Controllers.fleet,
//   mainGridController: p2Controllers.mainGrid,
//   trackingGridController: p2Controllers.trackingGrid
// });
// p2Controllers.board = p2Board;
// initializeControllerStates(p2Controllers);
// p2Board.setTrackingFleet(p1Controllers.fleet.getTrackingFleet());
// model.setP2({ playerModel: p2Model, boardController: p2Board });
