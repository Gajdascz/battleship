/**
 * Factory function for managing AI's strategic moves in a game. It includes validation,
 * prioritization, and tracking of moves.
 * @param {function(array)} validateFn Function to validate a move.
 *  |-> Expects a coordinate pair and returns a boolean.
 * @param {number} initialTotalAvailableMoves Total number of moves available in the game.
 * @param {function(array)} priorityAssessment Function to assess the priority of a move.
 *  |-> Expects a coordinate pair and returns a priority score.
 * @returns {object} An object with methods for move management.
 *  |-> Includes assessing, prioritizing, and tracking moves.
 */
export const MovesManager = (
  validateFn,
  initialTotalAvailableMoves,
  getCurrentTotalAvailableMoves,
  getAvailableMoves,
  priorityAssessment
) => {
  const areCoordinatesEqual = (c1, c2) => c1[0] === c2[0] && c1[1] === c2[1];
  const popFirst = (array) => array.splice(0, 1)[0];

  const priorityMoves = [];
  const totalPossibleMoves = initialTotalAvailableMoves;

  /**
   * Checks if a move is both valid and unique within the current game context.
   * @param {array} move Coordinate pair, or an object with a 'coordinates' property.
   * @returns {boolean} True if the move is valid and not already prioritized, false otherwise.
   */
  const isMoveUnique = (move) => {
    const moveToCheck = move?.coordinates ?? move;
    return (
      validateFn(moveToCheck) &&
      !priorityMoves.some((bestMove) => areCoordinatesEqual(moveToCheck, bestMove.coordinates))
    );
  };

  /**
   * Processes and prioritizes a set of moves based on their calculated priority scores.
   * Filters out moves with zero or negative priority and non-unique moves.
   * @param {array[]} moves Array of coordinate pairs or objects with 'coordinates' property.
   * @returns {object[]} Array of objects with 'coordinates' and 'priority', sorted by priority in descending order.
   */
  const assessMoves = (moves) =>
    moves
      ?.map((move) => ({
        coordinates: move?.coordinates ?? move,
        priority: priorityAssessment(move?.coordinates ?? move)
      }))
      .filter((move) => move.priority > 0 && isMoveUnique(move.coordinates))
      .sort((a, b) => b.priority - a.priority);

  /**
   * Updates the internal storage of priority moves with a new set of moves, if provided.
   * Combines new moves with existing priority moves, reassesses, and updates the priority list.
   * @param {array[]} moves (Optional) Additional moves to be assessed and prioritized.
   */
  const assessPriorityMoves = (moves = []) => {
    const uniqueMoves = moves.filter(isMoveUnique);
    const assessPool = [...priorityMoves, ...uniqueMoves];
    priorityMoves.length = 0;
    priorityMoves.push(...assessMoves(assessPool));
  };

  const getHighestPriorityMove = () => {
    if (priorityMoves.length === 0) return null;
    const move = popFirst(priorityMoves);
    return move.coordinates;
  };
  const getPriorityMoves = () => priorityMoves.map((move) => move.coordinates.slice());

  const getPercentageOfMovesLeft = () => 1 - getCurrentTotalAvailableMoves / totalPossibleMoves;

  const assessAllPossibleMoves = () => assessPriorityMoves(getAvailableMoves());

  return {
    getPercentageOfMovesLeft,
    assessMoves,
    assessPriorityMoves,
    getHighestPriorityMove,
    getPriorityMoves,
    assessAllPossibleMoves,
    hasPriorityMoves: () => priorityMoves.length > 0
  };
};
