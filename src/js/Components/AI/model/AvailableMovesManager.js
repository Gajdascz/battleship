import { STATUSES } from '../../../Utility/constants/common';
import {
  popRandom,
  popFrom,
  areCoordinatesEqual,
  getRandom,
  getFrom
} from '../ai/utilities/helperFunctions';

/**
 * @module AvailableMovesManager
 * Module to manage AI's available moves for Battleship. It abstracts move-related logic,
 * facilitating maintainability and enhancement of the AI's decision-making processes.
 */

/**
 * Factory function to create a manager for the AI's available moves.
 * This isolates move management for easy integration and upgrades in AI logic.
 * @function
 * @returns {object} An interface for managing and retrieving AI's available moves.
 */
export const AvailableMovesManager = () => {
  const availableMoves = [];

  /**
   * Initializes the manager with coordinates of moves based on the game's current state.
   * Identifies UNEXPLORED cells to populate the availableMoves storage array.
   * @param {number[][]} grid - The game board matrix to scan for initial moves.
   */
  const initializeAvailableMoves = (grid) => {
    availableMoves.length = 0;
    grid.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        if (col === STATUSES.UNEXPLORED) availableMoves.push([rowIndex, colIndex]);
      });
    });
  };

  const popRandomMove = () => popRandom(availableMoves);
  const getRandomMove = () => getRandom(availableMoves);
  const getIndex = (coordinates) =>
    availableMoves.findIndex((move) => areCoordinatesEqual(move, coordinates));

  /**
   * Retrieves and removes a specific move.
   * @param {number[]} coordinates - Move to retrieve [x, y].
   * @returns {number[]|null} Requested move, or null if unavailable.
   */
  const popMove = (coordinates) => {
    const index = getIndex(coordinates);
    return index !== -1 ? popFrom(availableMoves, index) : null;
  };

  /**
   * Retrieves a copy of a specific move.
   * @param {number[]} coordinates - Move to retrieve [x, y].
   * @returns {number[]|null} Requested move, or null if unavailable.
   */
  const getMove = (coordinates) => {
    const index = getIndex(coordinates);
    return index !== -1 ? getFrom(availableMoves, index) : null;
  };

  return {
    initializeAvailableMoves,
    getRandomMove,
    getMove,
    popRandomMove,
    popMove,
    getTotalAvailableMoves: () => availableMoves.length,
    getAvailableMoves: () => availableMoves.map((move) => move.slice())
  };
};
