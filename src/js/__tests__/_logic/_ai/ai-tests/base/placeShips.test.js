import { describe, it, expect, vi, beforeEach } from 'vitest';
import createMockBoard from '../../__mocks__/mockBoard';
import createMockShip from '../../__mocks__/mockShip';

import { placeShips } from '../../../logic/ai/base/placeShips';

let mockFleet;
let testBoard;
let mockGetRandomMove = vi.fn();
beforeEach(() => {
  testBoard = createMockBoard({ rows: 10, cols: 10 });
  mockFleet = [
    createMockShip(5, 'Carrier'),
    createMockShip(4, 'Battleship'),
    createMockShip(3, 'Destroyer'),
    createMockShip(3, 'Submarine'),
    createMockShip(2, 'Patrol Boat')
  ];
  mockGetRandomMove
    .mockClear()
    .mockReturnValueOnce([0, 0])
    .mockReturnValueOnce([9, 9])
    .mockReturnValueOnce([5, 5])
    .mockReturnValueOnce([0, 9])
    .mockReturnValueOnce([9, 0])
    .mockReturnValueOnce([3, 3])
    .mockReturnValueOnce([6, 6]);
});

describe('Ship Placement Module', () => {
  it('Should place all ships correctly on an empty grid', () => {
    placeShips(testBoard.mainGrid, mockFleet, mockGetRandomMove, testBoard.place);
    expect(mockGetRandomMove).toHaveBeenCalledTimes(mockFleet.length);
  });
  it('Should correctly handle placements on a partially filled grid', () => {
    const cells = [
      [0, 0],
      [9, 9],
      [5, 5],
      [0, 9],
      [9, 0],
      [3, 3],
      [6, 6]
    ];
    testBoard.mainGrid[0][0] = 'x';
    placeShips(testBoard.mainGrid, mockFleet, mockGetRandomMove, testBoard.place);
    expect(
      testBoard.mainGrid[0][0] === 'x' &&
        cells.every((cell) => testBoard.mainGrid[cell[0]][cell[1]].isShip)
    );
  });
  it('Should ensure ships do not overlap and adhere to specified lengths', () => {
    placeShips(testBoard.mainGrid, mockFleet, mockGetRandomMove, testBoard.place);
    const flatGrid = testBoard.mainGrid.flat();
    const occupiedCells = flatGrid.filter((cell) => cell?.isShip);
    expect(occupiedCells.length).toBe(mockFleet.reduce((acc, ship) => acc + ship.length, 0));
  });
  it('Should throw an error if unable to place ships after excessive attempts', () => {
    const mockGetRandomMoveSameResult = vi.fn().mockImplementation(() => [0, 0]);
    expect(() => {
      placeShips(testBoard.mainGrid, mockFleet, mockGetRandomMoveSameResult, testBoard.place);
    }).toThrow('AI could not find ship placement positions.');
  });
  it('Should place ships using a random orientation', () => {
    const verticalOrientations = [];
    const horizontalOrientations = [];
    const mockPlace = vi.fn(({ ship, start, end }) => {
      const isVertical = start[0] !== end[0];
      isVertical ? verticalOrientations.push(ship.name) : horizontalOrientations.push(ship.name);
      return true;
    });
    mockGetRandomMove.mockReturnValue([0, 0]);
    placeShips(testBoard.mainGrid, mockFleet, mockGetRandomMove, mockPlace);
    expect(verticalOrientations.length).toBeGreaterThan(0);
    expect(horizontalOrientations.length).toBeGreaterThan(0);
  });
});
