import { test, expect, beforeEach, describe, vi } from 'vitest';

import createMockPlayer from '../../../__mocks/mockPlayer';
import createMockBoard from '../../../__mocks/mockBoard';
import createMockShip from '../../../__mocks/mockShip';
import createMockAI from '../../../__mocks/mockAI';

import initializeGameObjects from '../../../../logic/game/initialization/initializeGameObjects';

vi.mock('../../../../logic/game/factories/Player.js', () => ({ default: createMockPlayer }));
vi.mock('../../../../logic/game/factories/Ship.js', () => ({ default: createMockShip }));
vi.mock('../../../../logic/game/factories/Board.js', () => ({ default: createMockBoard }));
vi.mock('../../../../logic/game/factories/AI.js', () => ({ default: createMockAI }));

let p1, p2, bOptions, fleet, gameMode;
const p1Info = { type: 'human', name: 'Player' };
const p2Info = { type: 'ai', name: 'Computer', difficulty: 0 };
const boardOptions = { rows: 10, cols: 10, letterAxis: 'row' };

beforeEach(() => {
  const { _playerOne, _playerTwo, _gameMode, _fleet } = initializeGameObjects(
    p1Info,
    p2Info,
    boardOptions
  );
  p1 = _playerOne;
  p2 = _playerTwo;
  gameMode = _gameMode;
  bOptions = boardOptions;
  fleet = _fleet;
});
describe('Game Initializers Object', () => {
  const checkPlayer = (player, name, type, id) => {
    if (type === 'human')
      return player.isPlayer && player.name === name && player.type === type && player.id === id;
    else
      return (
        player.isPlayer &&
        player.name === name &&
        player.type === type &&
        player.isAI &&
        player.id === id
      );
  };
  test('Should initialize player objects properly', () => {
    expect(checkPlayer(p1, p1Info.name, p1Info.type, 'playerOne')).toBe(true);
    expect(checkPlayer(p2, p2Info.name, p2Info.type, 'playerTwo')).toBe(true);
  });
  test('Should initialize and add player board objects properly', () => {
    expect(bOptions).toBe(bOptions);
    expect(p1.board.isBoard).toBe(true);
    expect(p2.board.isBoard).toBe(true);
    expect(p1.opponentsBoardIsReferenceTo).toHaveBeenCalledWith(p2.board);
    expect(p2.opponentsBoardIsReferenceTo).toHaveBeenCalledWith(p1.board);
  });

  test('Should build and initialize player fleets properly', () => {
    const gameFleet = [
      { length: 5, name: 'Carrier' },
      { length: 4, name: 'Battleship' },
      { length: 3, name: 'Destroyer' },
      { length: 3, name: 'Submarine' },
      { length: 2, name: 'Patrol Boat' }
    ];
    fleet.forEach((ship, index) => {
      expect(ship.length === gameFleet[index].length && ship.name === gameFleet[index].name).toBe(
        true
      );
    });
  });

  test('Should return correct game mode', () => {
    expect(gameMode).toBe('HvA');
    const { _gameMode } = initializeGameObjects(p1Info, p1Info, boardOptions);
    gameMode = _gameMode;
    expect(gameMode).toBe('HvH');
  });

  test('Should initialize extended AI properties', () => {
    expect(p2.initializeAvailableMoves).toHaveBeenCalled();
    expect(p2.initializeFleetTracker).toHaveBeenCalledTimes(0);
    const p2Info = { type: 'ai', name: 'Computer', difficulty: 2 };
    const { _playerTwo } = initializeGameObjects(p1Info, p2Info, boardOptions);
    p2 = _playerTwo;
  });
});
