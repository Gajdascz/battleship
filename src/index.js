import './styles/normalize.css';
import './styles/style.css';
import './styles/page-style.css';

import { InstructionsDialogView } from './js/Components/Dialogs/InstructionsDialog/InstructionsDialogView';

import { AlternatePlayerDialogView } from './js/Components/Dialogs/AlternatePlayersDialog/AlternatePlayerDialogView';
import { GameCoordinator } from './js/Components/Game/GameCoordinator';

const instructionsDialog = InstructionsDialogView();
const alternatePlayerDialog = AlternatePlayerDialogView();

const body = document.querySelector('body');

instructionsDialog.setContainer(body);
alternatePlayerDialog.setContainer(body);

document
  .querySelector('.instructions-button')
  .addEventListener('click', (e) => instructionsDialog.display());
