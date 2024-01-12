import createPlayer from '../factories/player';
import computerAI from '../ai/ai';
import board from '../factories/board';
import ship from '../factories/ship';

function gameInitializers() {
  const player = (playerInfo) => {
    if (playerInfo.type === 'human') return createPlayer(playerInfo.name, playerInfo.type, playerInfo.id);
    else return computerAI(+playerInfo.difficulty, playerInfo.id);
  };

  const playerBoards = (playerOne, playerTwo, boardOptions = { rows: 10, cols: 10, letterAxis: 'row' }) => {
    playerOne.board = board(boardOptions);
    playerTwo.board = board(boardOptions);
    playerOne.opponentsBoard = playerTwo.board;
    playerTwo.opponentsBoard = playerOne.board;
    return boardOptions;
  };

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
      playerOne.addShip(ship(shipInfo.length, shipInfo.name));
      playerTwo.addShip(ship(shipInfo.length, shipInfo.name));
    });
    return gameFleet;
  };

  const gameMode = (playerOneType, playerTwoType) => {
    if (playerOneType === 'human' && playerTwoType === 'human') return 'HvH';
    else return 'HvA';
  };

  const ai = (aiPlayer) => {
    aiPlayer.initializeAvailableMoves();
    if (aiPlayer.difficulty > 1) {
      aiPlayer.initializeOpponentFleetTracker();
    }
  };

  return { player, playerBoards, playerFleets, gameMode, ai };
}

export { gameInitializers };
