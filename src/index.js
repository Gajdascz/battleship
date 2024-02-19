import { GameController } from './js/components/Game/GameController';
import './styles/normalize.css';
import './styles/style.css';
import { DEFAULT_FLEET } from './js/utility/constants/components/fleet';

import { buildSettingsDialogUIObj } from './js/components/Dialogs/SettingsDialog/view/buildSettingsDialogUIObj';

const gridConfig = {
  numberOfRows: 10,
  numberOfCols: 10,
  letterAxis: 'row'
};
const playerOne = {
  playerData: {
    name: 'p1',
    id: 'playerOne'
  },
  gridConfig,
  shipData: DEFAULT_FLEET
};
const playerTwo = {
  playerData: {
    name: 'p2',
    id: 'playerTwo'
  },
  gridConfig,
  shipData: DEFAULT_FLEET
};

const gameController = GameController();
gameController.startGame({ p1Data: playerOne });

const settingsDialog = buildSettingsDialogUIObj();
const body = document.querySelector('body');
settingsDialog.appendDialog(body);
settingsDialog.showDialog();
// import buildSettingsDialog from './js/builders/SettingsDialog/buildSettingsDialog';
// // import RenderController from './js/ui/render/RenderController';

// import SessionStorage from './js/utility/SessionStorage';

// // import initiateGameController from './js/logic/game/initialization/initiateGameController';

// // const settingsDialog = buildSettingsDialog();
// // document.querySelector('body').append(settingsDialog);
// // settingsDialog.showModal();
// // document
// //   .querySelector('.settings-button')
// //   .addEventListener('click', (e) => settingsDialog.showModal());

// const storage = SessionStorage();

// // const renderController = { current: RenderController() };
// // const resetRender = () => {
// //   if (renderController.current) {
// //     renderController.current.reset();
// //     renderController.current = null;
// //   }
// //   renderController.current = RenderController();
// // };

// const getGameInfoObj = (e) => {
//   if (!e.detail) {
//     return {
//       playerOneInformation: storage.getPlayerOneDataObj(),
//       playerTwoInformation: storage.getPlayerTwoDataObj(),
//       boardOptions: storage.getBoardOptionsObj()
//     };
//   } else {
//     const { playerOneInformation, playerTwoInformation, boardOptions } = e.detail;
//     storage.clear();
//     storage.storePlayerOne(playerOneInformation);
//     storage.storePlayerTwo(playerTwoInformation);
//     storage.storeBoardOptions(boardOptions);
//     return e.detail;
//   }
// };

// const startGame = (e) => {
//   // const gameInfo = getGameInfoObj(e);
//   //  resetRender();
//   // initiateGameController(gameInfo);
// };

// document.addEventListener('settingsSubmit', startGame);
// document.addEventListener('gameRestarted', startGame);
