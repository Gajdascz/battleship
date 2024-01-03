import createPlayer from '../factories/player';
import computerAI from '../factories/ai';
import board from '../factories/board';
import ship from '../factories/ship';

function gameInitializers() {
  const player = (playerInfo) => {
    return playerInfo.type === 'human' ? createPlayer(playerInfo.name) : computerAI(+playerInfo.difficulty);
  };

  const playerBoards = (playerOne, playerTwo, boardOptions = { rows: 10, cols: 10, letterAxis: 'row' }) => {
    playerOne.board = board(boardOptions);
    playerTwo.board = board(boardOptions);
    playerOne.opponentsBoard = playerTwo.board;
    playerTwo.opponentsBoard = playerOne.board;
    return boardOptions;
  };

  const playerFleets = (playerOne, playerTwo, fleetType = 'default') => {
    let gameFleet;
    if (fleetType === 'default') {
      gameFleet = [
        [5, 'Carrier'],
        [4, 'Battleship'],
        [3, 'Destroyer'],
        [3, 'Submarine'],
        [2, 'Patrol Board']
      ];
    } else if (Array.isArray(fleetType) && fleetType.length > 0) gameFleet = fleetType;
    else playerFleets('default');
    playerOne.clearFleet();
    playerTwo.clearFleet();
    gameFleet.forEach((shipInfo) => {
      playerOne.addShip(ship(...shipInfo));
      playerTwo.addShip(ship(...shipInfo));
    });
    return gameFleet;
  };

  return { player, playerBoards, playerFleets };
}

export { gameInitializers };
