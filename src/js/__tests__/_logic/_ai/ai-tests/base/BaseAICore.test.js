import { describe, expect, it, beforeEach } from 'vitest';
import { RESULTS } from '../../../utility/constants.js';
import createMockBoard from '../../__mocks__/mockBoard.js';
import createMockShip from '../../__mocks__/mockShip.js';
import createMockPlayer from '../../__mocks__/mockPlayer.js';
import createMockAI from '../../__mocks__/mockAI.js';
import addBaseAILogic from '../../../logic/ai/base/BaseAICore.js';

const defaultFleet = [
  createMockShip(5, 'carrier'),
  createMockShip(4, 'battleship'),
  createMockShip(3, 'submarine'),
  createMockShip(3, 'destroyer'),
  createMockShip(2, 'patrol-boat')
];

const getOpponent = () => {
  const opponent = createMockPlayer('Player', 'opponent');
  opponent.board = createMockBoard();
  opponent.addShip(defaultFleet);
  return opponent;
};

const isWithinBoardBounds = (board, move) => {
  const rows = board.mainGrid.length;
  const cols = board.mainGrid[0].length;
  return move[0] < rows && move[0] >= 0 && move[1] < cols && move[1] >= 0;
};

const addBaseProperties = (ai) => {
  ai.board = createMockBoard();
  addBaseAILogic(ai);
  ai.initializeAvailableMoves();
  ai.addShip(defaultFleet);
};
describe('AI Object', () => {
  describe('AI Initialization', () => {
    let ai;
    beforeEach(() => {
      ai = createMockAI(0, 'ai');
      addBaseProperties(ai);
    });
    it('Should initialize and extend player object with additional base properties', () => {
      const opponent = getOpponent();
      ai.opponentsBoard = opponent.board;
      expect(ai.isPlayer).toBe(true);
      expect(ai.isAI).toBe(true);
      expect(ai.difficulty).toBe(0);
      expect(ai.id).toBe('ai');
      expect(ai.board.isBoard).toBe(true);
      expect(ai.opponentsBoardIsReferenceTo(opponent.board)).toBe(true);
      expect(ai.getAvailableMoves).toBeDefined();
      expect(ai.getMove).toBeDefined();
      expect(ai.getTotalAvailableMoves).toBeDefined();
      expect(ai.getRandomMove).toBeDefined();
      expect(ai.sendAttack).toBeDefined();
    });

    it('Should initialize available moves from all spaces in stored board', () => {
      const gridSpaces = ai.board.mainGrid.length * ai.board.mainGrid[0].length;
      expect(ai.getTotalAvailableMoves()).toEqual(gridSpaces);
    });

    it('Should select random available move', () => {
      expect(ai.getRandomMove()).toEqual([expect.any(Number), expect.any(Number)]);
      expect(isWithinBoardBounds(ai.board, ai.getRandomMove())).toBe(true);
    });

    it('Should place all ships stored in fleet', () => {
      ai.placeShips();
      expect(ai.fleet.length).toEqual(ai.fleet.length);
    });

    it('Should send a random attack and remove used move', () => {
      const opponent = getOpponent();
      ai.opponentsBoard = opponent.board;
      const movesBeforeAttack = ai.getTotalAvailableMoves();
      const result = ai.sendAttack([9, 9]);
      expect(result === RESULTS.HIT || result === RESULTS.MISS).toBe(true);
      const movesAfterAttack = ai.getTotalAvailableMoves();
      expect(movesBeforeAttack).toEqual(movesAfterAttack + 1);
    });
  });
});
