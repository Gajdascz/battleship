import './styles/normalize.css';
import './styles/style.css';

import buildSettingsDialog from './js/ui/settings-dialog/buildSettingsDialog';
import gameController from './js/logic/battleship/gameController';
import './js/ui/render/render';
const settingsDialog = buildSettingsDialog();
document.querySelector('body').append(settingsDialog);
//settingsDialog.showModal();

document.querySelector('.settings-button').addEventListener('click', (e) => settingsDialog.showModal());

document.addEventListener('settingsSubmit', function (e) {
  const controller = gameController(e.detail);
  controller.startGame();
});
