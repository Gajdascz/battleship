import './styles/normalize.css';
import './styles/style.css';
import './styles/page-style.css';

import { SettingsDialogController } from './js/Components/Dialogs/SettingsDialog/SettingsDialogController';
import { InstructionsDialogView } from './js/Components/Dialogs/InstructionsDialog/InstructionsDialogView';

import { AlternatePlayerDialogView } from './js/Components/Dialogs/AlternatePlayersDialog/AlternatePlayerDialogView';
import { GameOverDialogView } from './js/Components/Dialogs/GameOverDialog/GameOverDialogView';
import { GameCoordinator } from './js/Components/Game/utility/GameCoordinator';
import { globalEmitter } from './js/Events/core/EventEmitter';

const instructionsDialog = InstructionsDialogView();
const alternatePlayerDialog = AlternatePlayerDialogView();
const gameOverDialog = GameOverDialogView();

const body = document.querySelector('body');

instructionsDialog.setContainer(body);
alternatePlayerDialog.setContainer(body);
gameOverDialog.setContainer(body);

document
  .querySelector('.instructions-button')
  .addEventListener('click', (e) => instructionsDialog.display());
