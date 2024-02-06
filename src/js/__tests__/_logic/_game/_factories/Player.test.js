import { it, expect, beforeEach, describe } from 'vitest';
import createMockShip from '../../../__mocks/mockShip';
import createMockBoard from '../../../__mocks/mockBoard';

import createPlayer from '../../../../logic/game/factories/Player';

describe('Player Object', () => {
  let playerOne, playerTwo;
  beforeEach(() => {
    playerOne = createPlayer();
    playerTwo = createPlayer('Odin');
  });
  describe('Player initialization', () => {
    it('Should set invalid input name to Mutinous', () => {
      expect(playerOne.name).toBe('Mutinous');
    });
    it('Should assign valid Name', () => {
      expect(playerTwo.name).toBe('Odin');
    });
    it('Should initialize with board set to null and no ships in fleet', () => {
      expect(playerOne.board).toBe(null);
      expect(playerOne.fleet.length).toBe(0);
    });
  });

  describe('Player Board Methods', () => {
    let p1Board, p2Board;
    beforeEach(() => {
      p1Board = createMockBoard();
      p2Board = createMockBoard();
      playerOne.board = p1Board;
      playerTwo.board = p2Board;
      playerOne.opponentsBoard = playerTwo.board;
      playerTwo.opponentsBoard = playerOne.board;
    });
    const addFleet = (player) =>
      player.addShip([
        createMockShip(5, 'Submarine'),
        createMockShip(10, 'Scout'),
        createMockShip(42, 'Patrol')
      ]);

    it('Should assign board object to player', () => {
      expect(playerOne.board.isBoard).toBe(true);
    });
    it("Should assign playerTwo's board as playerOne's opponentsBoard and vice versa", () => {
      expect(playerOne.hasOpponentsBoard).toBe(true);
      expect(playerOne.opponentsBoardIsReferenceTo(playerTwo.board)).toBe(true);
      expect(playerTwo.hasOpponentsBoard).toBe(true);
      expect(playerTwo.opponentsBoardIsReferenceTo(playerOne.board)).toBe(true);
    });

    it('Should add ships to players fleet', () => {
      addFleet(playerOne);
      expect(playerOne.fleet.length).toBe(3);
    });
    it('Should reject invalid ship input', () => {
      const badShip = { name: 'badShip' };
      const badShipInputError = `Invalid input. Expected a ship object or an array of ship objects. Received: ${badShip}`;
      const badShipInArrayError = `Invalid ship detected in the array. Cannot be added to player's fleet: ${badShip}`;
      const testBadShip = (badShip, error) => {
        expect(() => playerOne.addShip(badShip).toThrow(error));
      };

      testBadShip(badShip, badShipInputError);
      testBadShip([createMockShip(), badShip], badShipInArrayError);
      testBadShip([badShip, createMockShip()], badShipInArrayError);
    });
    it('Should remove ships from players fleet', () => {
      addFleet(playerOne);
      playerOne.removeShip('Submarine');
      expect(playerOne.fleet.length).toBe(2);
      playerOne.removeShip('Scout');
      expect(playerOne.fleet.length).toBe(1);
    });
    it('Should send attack between players board and opponents board', () => {
      const result = playerOne.sendOutgoingAttack([0, 5]);
      expect(result).toBe(false);
      expect(playerOne.board.outgoingAttack).toHaveBeenCalledWith([0, 5], p2Board);
      expect(playerTwo.board.incomingAttack).toHaveBeenCalledWith([0, 5]);
      expect(playerTwo.board.incomingAttack).toHaveReturnedWith(false);
    });
    it('Should retrieve last opponent ship sunk', () => {
      playerTwo.board.setLastShipSunk('ship');
      expect(playerOne.getLastOpponentShipSunk()).toBe('ship');
    });
  });
});
