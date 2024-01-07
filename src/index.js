import './styles/normalize.css';
import './styles/style.css';

import { buildSettingsDialog } from './js/ui/settings-dialog/buildSettingsDialog';
import gameController from './js/logic/battleship/gameController';
import gameLoopModule from './js/logic/battleship/gameLoop';
import buildGameBoard from './js/ui/game-board/buildGameBoard';
import renderModule from './js/ui/render/render';

const settingsDialog = buildSettingsDialog();
document.querySelector('body').append(settingsDialog);
//settingsDialog.showModal();

document.querySelector('.settings-button').addEventListener('click', (e) => settingsDialog.showModal());

const controller = gameController();
const render = renderModule(controller.boardOptions);
render.initiateFleets(controller.playerOne.fleet, controller.playerTwo.fleet);
render.board(controller.currentPlayer, controller.state);
render.currentPlayer(controller.currentPlayer.name);

document.addEventListener('settingsSubmit', function (e) {
  const controller = gameController(e.detail);
  const render = renderModule(controller.boardOptions);
  console.log(controller);
  render.initiateFleets(controller.playerOne.fleet, controller.playerTwo.fleet);
  render.board(controller.currentPlayer, controller.state);
  render.currentPlayer(controller.currentPlayer.name);
});
