import { DEFAULT_FLEET } from '../../Fleet/common/fleetConstants';
import { GAME_MODES, PLAYERS } from '../../../Utility/constants/common';
import { PlayerSetupManager } from './PlayerSetupManager';
import { configureBoardControllers } from './PlayerBoardConfigurator';

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
    p1: PlayerSetupManager(p1Settings, boardSettings, shipData),
    p2: PlayerSetupManager(p2Settings, boardSettings, shipData)
  };
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
