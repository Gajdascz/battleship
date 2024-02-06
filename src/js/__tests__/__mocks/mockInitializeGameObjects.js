import { vi } from 'vitest';
import createMockPlayer from './mockPlayer';
import createMockBoard from './mockBoard';
import createMockShip from './mockShip';
import createMockAI from './mockAI';

let globalPlayerOne, globalPlayerTwo;

export default vi.fn(function mockInitializeGameObjects(p1Info, p2Info, boardOptions) {
  p1Info.id = 'playerOne';
  p2Info.id = 'playerTwo';
  const player = vi.fn((playerInfo) => {
    if (playerInfo.type === 'human') return createMockPlayer(playerInfo.name, playerInfo.id);
    else return createMockAI(+playerInfo.difficulty, playerInfo.id);
  });
  const playerBoards = vi.fn((playerOne, playerTwo, boardOptions = { rows: 10, cols: 10 }) => {
    playerOne.board = createMockBoard(boardOptions);
    playerTwo.board = createMockBoard(boardOptions);
    playerOne.opponentsBoard = playerTwo.board;
    playerTwo.opponentsBoard = playerOne.board;
    if (
      !playerOne.opponentsBoardIsReferenceTo(playerTwo.board) ||
      !playerTwo.opponentsBoardIsReferenceTo(playerOne.board)
    )
      throw new Error(`Player board references are not a match.`);
    return boardOptions;
  });

  const playerFleets = vi.fn((playerOne, playerTwo) => {
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
      playerOne.addShip(createMockShip(shipInfo.length, shipInfo.name));
      playerTwo.addShip(createMockShip(shipInfo.length, shipInfo.name));
    });
    return gameFleet;
  });

  const gameMode = vi.fn((playerTwoType) => (playerTwoType === 'human' ? 'HvH' : 'HvA'));

  const ai = vi.fn((aiPlayer) => {
    aiPlayer.initializeAvailableMoves();
    if (aiPlayer.difficulty > 1) {
      aiPlayer.initializeOpponentFleetTracker();
    }
  });

  const _playerOne = player(p1Info);
  const _playerTwo = player(p2Info);
  playerBoards(_playerOne, _playerTwo, boardOptions);
  const _fleet = playerFleets(_playerOne, _playerTwo);
  const _gameMode = gameMode(_playerTwo.type);
  const _boardOptions = boardOptions;
  if (_playerTwo.type === 'ai') ai(_playerTwo);

  globalPlayerOne = _playerOne;
  globalPlayerTwo = _playerTwo;

  return { _playerOne, _playerTwo, _gameMode, _fleet, _boardOptions };
});

export const getTestPlayers = () => ({ globalPlayerOne, globalPlayerTwo });
