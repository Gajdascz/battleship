import { vi, describe, expect, test, beforeEach } from 'vitest';
import computerAi from '../factories/ai';
import { createMockBoard as board } from './__mocks__/mockModules.';

const containsMove = (movesArray, move) => movesArray.some((m) => m[0] === move[0] && m[1] === move[1]);
describe('AI', () => {
  let ai;
  describe('Base AI', () => {
    beforeEach(() => {
      ai = computerAi(0);
      ai.board = board({ rows: 5, cols: 5, letterAxis: 'row' });
      ai.opponentsBoard = board({ rows: 5, cols: 5, letterAxis: 'row' });
      ai.initializeAvailableMoves();
    });
    test.each([
      ['isAI', () => ai.isAI, true],
      ['Has board', () => ai.board.isBoard, true],
      ['Has opponents board', () => ai.hasOpponentsBoard, true],
      ['Available moves initialized', () => ai.availableMoves.length, 25],
      [
        'Remove available move',
        () => {
          ai.removeAvailableMove([0, 0]);
          return !containsMove(ai.availableMoves, [0, 0]);
        },
        true
      ],
      ['Get random move', () => containsMove(ai.availableMoves, ai.getRandomMove()), true],
      ['Send attack - Miss', () => ai.sendAttack([0, 0]), false],
      [
        'Attack is a hit',
        () => {
          const newBoard = board();
          newBoard.place([0, 0]);
          ai.opponentsBoard = newBoard;
          return ai.sendAttack([0, 0]);
        },
        true
      ]
    ])('Base AI %s', (description, actual, expected) => {
      expect(actual()).toEqual(expected);
    });
    describe.only('Advanced AI', () => {
      beforeEach(() => {
        ai = computerAi(2);
        ai.board = board({ rows: 10, cols: 10, letterAxis: 'row' });
        ai.opponentsBoard = board({ rows: 10, cols: 10, letterAxis: 'row' });
        ai.initializeAvailableMoves();
      });
      test('AI follows up on a hit', () => {
        ai.lastHit = [3, 3];
        ai.board.trackingGrid[3][3] = 1;
        ai.board.trackingGrid[3][4] = 0;
        const boardWithShip = board();
        boardWithShip.place([3, 2]);
        boardWithShip.mainGrid[3][3] = 1;
        boardWithShip.mainGrid[3][4] = 0;
        ai.opponentsBoard = boardWithShip;
        const move = ai.makeMove();
        expect(boardWithShip.mainGrid[3][2]).toEqual(1);
      });
    });
  });
});
