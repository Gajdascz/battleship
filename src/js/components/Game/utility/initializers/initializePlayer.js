import { DEFAULT_FLEET } from '../../../../utility/constants/components/fleet';
import { initializeFleet } from './fleetInitializer';
import { initializeBoard } from './boardInitializer';
import { PlayerModel } from '../../../Player/PlayerModel';

export const initializePlayer = ({
  playerData,
  boardConfigData,
  fleetShipData = DEFAULT_FLEET
}) => {
  const playerModel = PlayerModel({ name: playerData.name, id: playerData.id });
  const fleet = initializeFleet(fleetShipData);
  const board = initializeBoard(boardConfigData, fleet);
  return { playerModel, fleet, board };
};
