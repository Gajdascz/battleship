import { SettingsDialogController } from '../../Dialogs/SettingsDialog/SettingsDialogController';
import { GameOverDialogView } from '../../Dialogs/GameOverDialog/GameOverDialogView';
import { AlternatePlayerDialogView } from '../../Dialogs/AlternatePlayersDialog/AlternatePlayerDialogView';

export const dialogsManager = (() => {
  const settings = SettingsDialogController();
  const gameOver = GameOverDialogView();
  const alternatePlayers = {
    dialog: null,
    get: () => {
      if (!alternatePlayers.dialog) alternatePlayers.dialog = AlternatePlayerDialogView();
      return alternatePlayers.dialog;
    },
    remove: () => (alternatePlayers.dialog = null)
  };
  document.querySelector('.settings-button').addEventListener('click', (e) => settings.display());
  return {
    settings,
    gameOver,
    alternatePlayers: {
      getDialog: alternatePlayers.get,
      removeDialog: alternatePlayers.remove
    }
  };
})();
