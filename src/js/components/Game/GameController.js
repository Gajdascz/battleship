import { DEFAULT_FLEET } from '../../utility/constants/components/fleet';
import { BoardCoordinator } from './BoardCoordinator';
import { PlayerModel } from '../Player/PlayerModel';
import { buildMainGridComponent } from '../../builders/MainGrid/buildMainGridComponent';
import { buildTrackingGridComponent } from '../../builders/TrackingGrid/buildTrackingGridComponent';
import { buildFleetComponent } from '../../builders/Fleet/buildFleetComponent';
import { buildShipComponent } from '../../builders/Ship/buildShipComponent';
import { handle } from './utility/controllerHandlers';
import stateManagerRegistry from '../../utility/stateManagement/stateManagerRegistry';
import eventEmitter from '../../utility/eventEmitter';
import { COMMON_EVENTS, GENERAL_EVENTS, PLACEMENT_EVENTS } from '../../utility/constants/events';
import { STATES } from '../../utility/constants/common';
import { initializePlayer } from './utility/initializers/initializePlayer';
import { initializeGameState } from './utility/initializers/gameStateInitializer';

export const GameController = (gameModel, gameView) => {
  const _model = gameModel;
  const _view = gameView;
  const _transition = { fn: null };

  const startGame = ({ p1Data, p2Data }) => {
    const playerOne = initializePlayer({
      playerData: p1Data.playerData,
      boardConfigData: p1Data.boardConfigData,
      fleetShipData: p1Data.fleetShipData
    });
    _transition.fn = initializeGameState();
    _transition.fn();
  };

  const switchCurrentPlayer = () => {};

  return { startGame };
};
