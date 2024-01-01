import { test, expect, beforeEach, vi, describe } from 'vitest';
import { createMockShip as ship, createMockBoard as board } from './__mocks__/mockModules.';
import createPlayer from '../factories/player';

vi.mock('../factories/board.js', () => ({ default: board() }));
vi.mock('../factories/ship.js', () => ({ default: ship() }));

describe('Player Object', () => {
  const playerOne = createPlayer(null);
  const playerTwo = createPlayer('Odin');
  describe('Player initialization', () => {
    test('Invalid Name', () => {
      expect(playerOne.name).toBe('mutinous');
    });
    test('Valid Name', () => {
      expect(playerTwo.name).toBe('Odin');
    });
    test('Wins, losses, and moves set to 0', () => {
      expect(playerOne.wins).toBe(0);
      expect(playerOne.losses).toBe(0);
      expect(playerOne.moves).toBe(0);
    });
    test('Board set to null and fleet is empty', () => {
      expect(playerOne.board).toBe(null);
      expect(playerOne.fleet.length).toBe(0);
    });
  });

  describe('Player methods', () => {
    test('Player Won', () => {
      playerOne.won();
      expect(playerOne.wins).toBe(1);
    });
    test('Player Lost', () => {
      playerOne.lost();
      expect(playerOne.losses).toBe(1);
    });
    test('Player made a move', () => {
      playerOne.moved();
      expect(playerOne.moves).toBe(1);
    });
    test('Player has a board', () => {
      playerOne.board = board();
      expect(playerOne.board.isBoard).toBe(true);
    });
    test('Player can add ships', () => {
      playerOne.addShip(ship(500, 'Destroyer'));
      expect(playerOne.fleet.length).toBe(1);
      playerOne.addShip([ship(5, 'Submarine'), ship(10, 'Scout'), ship(42, 'Life')]);
      expect(playerOne.fleet.length).toBe(4);
    });
    test('Player can remove ships', () => {
      playerOne.removeShip('Destroyer');
      expect(playerOne.fleet.length).toBe(3);
      playerOne.removeShip('Life');
      expect(playerOne.fleet.length).toBe(2);
    });
    test('Player can send attack', () => {
      playerOne.board = board();
      playerOne.opponentsBoard = board();
      const result = playerOne.sendOutgoingAttack([0, 5]);
      expect(result).toBe(false);
    });
  });

  test('Player reset stats', () => {
    playerOne.resetStats();
    expect(playerOne.wins).toBe(0);
    expect(playerOne.losses).toBe(0);
    expect(playerOne.moves).toBe(0);
  });
});
