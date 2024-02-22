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

import { ScopedEventSwitcher } from '../../utility/stateManagement/ScopedEventSwitcher';
import { buildAlternatePlayerDialogElement } from '../Dialogs/AlternatePlayersDialog/buildAlternatePlayerDialogElement';
import { buildUIElement } from '../../utility/uiBuilderUtils/uiBuilders';
import { COMMON_ELEMENTS } from '../../utility/constants/dom/elements';

const GAME_MODES = {
  HVH: 'HvH',
  HvA: 'HvA'
};

const getRenderStrategy = (gameMode) => {
  if (gameMode === GAME_MODES.HVH) {
    const alternatePlayerDialog = buildAlternatePlayerDialogElement();
    const endTurnButton = buildUIElement(COMMON_ELEMENTS.BUTTON, {
      text: 'End Turn',
      attributes: { class: 'end-turn-button' }
    });
    const onAttackProcessed = () => {
      // Disable tracking grid buttons (stop attacks)
      // Enable End Turn Button
    };
    const onTurnEnded = () => {
      // Display alternate player dialog
      // Switch Current players
      // Switch player boards in display
      // Enable player's tracking grid buttons (allow attacks)
    };
  } else {
    // Attach AI display to human player's board
  }
};

export const GameController = (startGameTrigger) => {
  const model = GameModel();
  const view = GameView();
  const stateController = StateController();
  const switcher = ScopedEventSwitcher();

  const initializePlayerComponents = ({ playerSettings, boardSettings }) => {
    const shipData = DEFAULT_FLEET;
    const { username, type, id } = playerSettings;
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
    switcher.registerScope(playerModel.getID());
    return { playerModel, controllers };
  };

  const playerManager = {
    displayCurrentPlayer: () => {
      model.switchCurrentPlayer();
      const currentPlayer = model.getCurrentPlayer();
      const board = currentPlayer.board.getBoardElement();
      view.updateBoard(board);
    },
    handlePlayerSwitch: () => {
      model.switchCurrentPlayer();
      playerManager.displayCurrentPlayer();
    }
  };

  const initializeStateController = () => {
    stateController.addSubscriptionToPlacement(PLACEMENT_EVENTS.ALL_PLACEMENTS_FINALIZED, () => '');
  };

  const handlePlacementsFinalized = () => {};

  const startGame = ({ data }) => {
    console.log(data);
    stateController.enable();
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
    switcher.setAllScopeSubscriptions(
      [PLACEMENT_EVENTS.GRID_PLACEMENTS_FINALIZED],
      playerManager.handlePlayerSwitch
    );
    switcher.setActiveScope(p1.playerModel.getID());
    stateController.transition(); // transition to placement state from start state.
    playerManager.displayCurrentPlayer();
  };

  eventEmitter.subscribe(startGameTrigger, startGame);
};
