import { DEFAULT_FLEET } from '../../Fleet/common/fleetConstants';
import { GAME_MODES, PLAYERS } from '../../../Utility/constants/common';
import { initializePlayer } from './initializePlayer';
import { configureBoardControllers } from './PlayerBoardConfigurator';
import { GameCoordinator } from './GameCoordinator';

export const GameSessionInitializer = ({
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

  const players = {
    p1: initializePlayer(p1Settings, boardSettings, shipData),
    p2: initializePlayer(p2Settings, boardSettings, shipData)
  };
  const coordinator = GameCoordinator({
    p1Id: players.p1.model.id,
    p2Id: players.p2.model.id
  });
  const { p1BoardController, p2BoardController } = configureBoardControllers(
    emitter,
    players.p1,
    players.p2,
    gameMode
  );

  return {
    p1BoardController,
    p2BoardController
  };
};
