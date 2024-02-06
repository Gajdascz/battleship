import createPlayer from '../factories/Player';
import createAI from '../factories/AI';
import createBoard from '../factories/Board';
import createShip from '../factories/Ship';

/**
 * @module initializeGameObjects.js
 * Provides the game controller with a centralized and streamlined method
 * to initialize the necessary internal game Objects required to play.
 *
 * Handles the initialization of player objects, AI logic, player fleets, player boards, and the game mode.
 */

/**
 * Returns an object containing all necessary and initialized objects for game play.
 *
 * @param {Object} p1Info Contains all initialization data for creating player one's player object.
 * @param {Object} p2Info Contains all initialization data for creating player one's player object.
 * @param {Object} boardOptions  Contains all initialization data for creating this game's board configuration.
 * @returns {Object} Provides methods to initialize corresponding internal Objects and properties.
 */
export default function initializeGameObjects(p1Info, p2Info, boardOptions) {
  p1Info.id = 'playerOne';
  p2Info.id = 'playerTwo';
  const player = (playerInfo) => {
    if (playerInfo.type === 'human') return createPlayer(playerInfo.name, playerInfo.id);
    else return createAI(+playerInfo.difficulty, playerInfo.id);
  };

  /**
   * Creates and assigns board objects to players ensuring consistency in game state critical data.
   *
   * @param {Object} playerOne First player object.
   * @param {Object} playerTwo Second player object.
   * @param {Object} boardOptions Contains rows, cols, and letterAxis.
   * @returns {Object} Returns passed board options for cleaner GameController initialization.
   */
  const playerBoards = (
    playerOne,
    playerTwo,
    boardOptions = { rows: 10, cols: 10, letterAxis: 'row' }
  ) => {
    playerOne.board = createBoard(boardOptions);
    playerTwo.board = createBoard(boardOptions);
    playerOne.opponentsBoard = playerTwo.board;
    playerTwo.opponentsBoard = playerOne.board;
    if (
      !playerOne.opponentsBoardIsReferenceTo(playerTwo.board) ||
      !playerTwo.opponentsBoardIsReferenceTo(playerOne.board)
    )
      throw new Error(`Player board references are not a match.`);
    return boardOptions;
  };

  /**
   * Creates ship objects and populates player's fleets.
   * Ensures each player is playing with a consistent set of ships.
   *
   * @param {Object} playerOne First player object for storing fleet.
   * @param {Object} playerTwo Second player object for storing fleet.
   * @returns {Object[]} Fleet used by both players in current game.
   */
  const playerFleets = (playerOne, playerTwo) => {
    const gameFleet = [
      { length: 5, name: 'Carrier' },
      { length: 4, name: 'Battleship' },
      { length: 3, name: 'Destroyer' },
      { length: 3, name: 'Submarine' },
      { length: 2, name: 'Patrol Boat' }
    ];
    playerOne.clearFleet();
    playerTwo.clearFleet();
    gameFleet.forEach((shipInfo) => {
      playerOne.addShip(createShip(shipInfo.length, shipInfo.name));
      playerTwo.addShip(createShip(shipInfo.length, shipInfo.name));
    });
    return gameFleet;
  };

  /**
   * Returns the current game mode.
   * Provides information for selecting the correct render strategy.
   *
   * @param {string} playerTwoType Type of player two (human or ai).
   * @returns {string} Game mode: HvH for human vs human or HvA for human vs AI.
   */
  const gameMode = (playerTwoType) => (playerTwoType === 'human' ? 'HvH' : 'HvA');

  /**
   * Initializes additional AI player setting.
   * Ensures the AI is provided it's necessary logic.
   *
   * @param {Object} aiPlayer AI player object.
   */
  const ai = (aiPlayer) => {
    // Provides the AI with all available moves based on game board.
    aiPlayer.initializeAvailableMoves();
    // Provides the AI with the specified level of intelligence.
    if (aiPlayer.difficulty >= 1) aiPlayer.initializeLogic();
  };

  const _playerOne = player(p1Info);
  const _playerTwo = player(p2Info);
  playerBoards(_playerOne, _playerTwo, boardOptions);
  const _fleet = playerFleets(_playerOne, _playerTwo);
  const _gameMode = gameMode(_playerTwo.type);
  const _boardOptions = boardOptions;
  if (_playerTwo.type === 'ai') ai(_playerTwo);

  return { _playerOne, _playerTwo, _gameMode, _fleet, _boardOptions };
}
