import './styles/normalize.css';
import './styles/style.css';

import { renderGameBoard } from './js/ui/render';
import { buildSettingsDialog } from './js/ui/element-builders/buildSettingsDialog';
import gameController from './js/logic/battleship/gameController';

const d = buildSettingsDialog();
document.querySelector('body').append(d);
d.showModal();
document.querySelector('.settings-button').addEventListener('click', (e) => d.showModal());

document.addEventListener('settingsSubmit', function (e) {
  gameController(e.detail);
});
