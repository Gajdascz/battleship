import { PlayerModel } from '../Player/PlayerModel';
import { FleetController } from '../Fleet/FleetController';
import { ShipController } from '../Ship/ShipController';
import { BoardController } from '../Board/BoardController';
import { GameModel } from './GameModel';
import { GameView } from './GameView';
import { MainGridController } from '../Grids/MainGrid/MainGridController';
import { TrackingGridController } from '../Grids/TrackingGrid/TrackingGridController';
import { DEFAULT_FLEET } from '../../utility/constants/components/fleet';

import { StateController } from '../../utility/stateManagement/StateController';
import { PLACEMENT_EVENTS } from '../../utility/constants/events';

import eventEmitter from '../../utility/events/eventEmitter';

export const GameController = (startGameTrigger) => {
  const model = GameModel();
  const view = GameView();
  const stateController = StateController();

  const initializePlayerComponents = ({ playerSettings, boardSettings }) => {
    const shipData = DEFAULT_FLEET;
    const { username, type, id } = playerSettings;
    const playerModel = PlayerModel({ playerName: username, playerType: type, playerID: id });
    const scope = playerModel.getID();
    const fleetController = FleetController(scope);
    const mainGridController = MainGridController(scope, boardSettings);
    const trackingGridController = TrackingGridController(scope, boardSettings);
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
    Object.values(controllers).forEach((controller) => controller.initializeStateManagement());
    return { playerModel, controllers };
  };

  const playerManager = {
    displayCurrentPlayer: () => {
      const currentPlayer = model.getCurrentPlayer();
      const board = currentPlayer.board.getBoardElement();
      view.updateBoard(board);
    },
    handlePlayerSwitch: () => {
      model.switchCurrentPlayer();
      playerManager.displayCurrentPlayer();
    }
  };

  const handlePlacementsFinalized = () => {};

  const initializeStateController = () => {
    stateController.addSubscriptionToPlacement(
      PLACEMENT_EVENTS.GRID_PLACEMENTS_FINALIZED,
      playerManager.handlePlayerSwitch
    );
  };

  const startGame = ({ data }) => {
    stateController.enable();
    initializeStateController();
    stateController.transition(); // transition to start state from no state.
    const { p1Settings, p2Settings, boardSettings } = data;
    const p1 = initializePlayerComponents({ playerSettings: p1Settings, boardSettings });
    const p2 = initializePlayerComponents({ playerSettings: p2Settings, boardSettings });
    model.setP1({ playerModel: p1.playerModel, boardController: p1.controllers.board });
    model.setP2({ playerModel: p2.playerModel, boardController: p2.controllers.board });
    model.setGameMode(
      `${p1.playerModel.getType().charAt(0).toUpperCase()}v${p2.playerModel
        .getType()
        .charAt(0)
        .toUpperCase()}`
    );
    stateController.transition(); // transition to placement state from start state.
    playerManager.displayCurrentPlayer();
  };

  eventEmitter.subscribe(startGameTrigger, startGame);
};
