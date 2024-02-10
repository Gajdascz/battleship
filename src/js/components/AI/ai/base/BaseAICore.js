import { AvailableMovesManager } from './AvailableMovesManager';
import { placeShips } from './placeShips';

/**
 * Enhances an AI player object with fundamental logic for playing Battleship. This setup
 * includes managing available moves, placing ships, and executing attacks, providing a
 * solid foundation for basic game play and potential AI strategy expansions.
 *
 * @param {object} ai - The AI player object to be enhanced.
 * @returns {object} The enhanced AI player object with fundamental game play logic.
 */
export default function addBaseAILogic(ai) {
  ai.hasBaseLogic = true;

  const movesManager = AvailableMovesManager();

  /**
   * Initializes available moves based on grid and game state for move management and processing.
   * @returns {void}
   */
  ai.initializeAvailableMoves = () => movesManager.initializeAvailableMoves(ai.board.trackingGrid);

  /**
   * Returns a copy of all currently available moves for processing.
   * @returns {array[number[]]} - Copy of all currently available moves.
   */
  ai.getAvailableMoves = () => movesManager.getAvailableMoves();

  /**
   * Retrieves and returns a copy of the available move if found.
   * @param {number[]} coordinates - Coordinates of move to retrieve.
   * @returns {number[]} - Coordinates from available moves.
   */
  ai.getMove = (coordinates) => movesManager.getMove(coordinates);

  /**
   * Returns total currently available moves.
   * @returns {number} - Total of currently available moves.
   */
  ai.getTotalAvailableMoves = () => movesManager.getTotalAvailableMoves();

  /**
   * Retrieves and returns a copy of randomly selected coordinates for an available move.
   * @returns {number[]} - Coordinates of a randomly selected available move.
   */
  ai.getRandomMove = () => movesManager.getRandomMove();

  /**
   * Randomly places the AI's fleet onto it's board's main grid.
   * @returns {void}
   */
  ai.initializeShipPlacement = () =>
    placeShips(ai.board.mainGrid, ai.fleet, ai.getRandomMove, ai.board.place);

  /**
   * Centralized attack function to execute and remove a move from available moves.
   * @param {number[]} move - Coordinates of move to execute.
   * @returns {number|boolean} - Result of outgoing attack.
   * @throws {Error} - If move is not an accessible  available move.
   */
  ai.sendAttack = (move) => {
    const attack = movesManager.popMove(move);
    if (!attack) {
      throw new Error(`Invalid Attack: ${move} cannot be accessed from availableMoves`);
    }
    return ai.sendOutgoingAttack(move);
  };
}
