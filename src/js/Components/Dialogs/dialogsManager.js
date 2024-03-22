import { SettingsDialogController } from './SettingsDialog/SettingsDialogController';
import { GameOverDialogView } from './GameOverDialog/GameOverDialogView';
import { AlternatePlayerDialogView } from './AlternatePlayersDialog/AlternatePlayerDialogView';
import { InstructionsDialogView } from './InstructionsDialog/InstructionsDialogView';

/**
 * Centrally manages the dialogs within the application.
 */
export const dialogsManager = (() => {
  const instructions = InstructionsDialogView();
  const settings = SettingsDialogController();
  const gameOver = GameOverDialogView();

  settings.setOpenInstructions(instructions.display);
  gameOver.setOpenSettings(settings.display);

  const alternatePlayers = {
    dialog: null,
    get: () => {
      if (!alternatePlayers.dialog) alternatePlayers.dialog = AlternatePlayerDialogView();
      return alternatePlayers.dialog;
    },
    remove: () => (alternatePlayers.dialog = null)
  };
  document.querySelector('.settings-button').addEventListener('click', (e) => settings.display());
  document
    .querySelector('.instructions-button')
    .addEventListener('click', (e) => instructions.display());
  return {
    settings,
    gameOver,
    alternatePlayers: {
      getDialog: alternatePlayers.get,
      removeDialog: alternatePlayers.remove
    }
  };
})();
