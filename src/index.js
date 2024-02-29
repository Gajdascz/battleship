import { GameController } from './js/Components/Game/GameController';
import './styles/normalize.css';
import './styles/style.css';
import './styles/page-style.css';

import { SettingsDialogController } from './js/Components/Dialogs/SettingsDialog/SettingsDialogController';
import { InstructionsDialogView } from './js/Components/Dialogs/InstructionsDialog/InstructionsDialogView';

import { AlternatePlayerDialogView } from './js/Components/Dialogs/AlternatePlayersDialog/AlternatePlayerDialogView';
import { GameOverDialogView } from './js/Components/Dialogs/GameOverDialog/GameOverDialogView';
import { GAME_EVENTS } from './js/Events/events';
GameController(GAME_EVENTS.SETTINGS_SUBMITTED);
const test = () => console.log('Game Over');
const settingsDialogController = SettingsDialogController();
const instructionsDialog = InstructionsDialogView();
const alternatePlayerDialog = AlternatePlayerDialogView();
const gameOverDialog = GameOverDialogView(test);
const body = document.querySelector('body');
settingsDialogController.setContainer(body);
instructionsDialog.setContainer(body);
alternatePlayerDialog.setContainer(body);
gameOverDialog.setContainer(body);
// gameOverDialog.display('ME!');
settingsDialogController.display();
// instructionsDialog.display();
// import buildSettingsDialog from './js/builders/SettingsDialog/buildSettingsDialog';
// // import RenderController from './js/ui/render/RenderController';

// import SessionStorage from './js/utility/SessionStorage';

// // import initiateGameController from './js/logic/game/initialization/initiateGameController';

document
  .querySelector('.settings-button')
  .addEventListener('click', (e) => settingsDialogController.display());

document
  .querySelector('.instructions-button')
  .addEventListener('click', (e) => instructionsDialog.display());
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
