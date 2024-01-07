import { buildElementTree } from '../utility-ui/elementObjBuilder';
import {
  playerInfoInputContainerObj,
  settingsTitleObj,
  boardSettingsContainerObj,
  settingsButtonsContainerObj
} from './settingsUIObjects';
import {
  addPlayersTypeSelectListeners,
  addChangeDifficultySelectListeners,
  addButtonListeners,
  addRestrictNumberInputsListener
} from './settingsDialogListeners';

export function buildSettingsDialog() {
  const settingsTitle = settingsTitleObj();
  const playerInfoInputContainer = playerInfoInputContainerObj();
  const boardSettingsContainer = boardSettingsContainerObj();
  const settingsButtonsContainer = settingsButtonsContainerObj();
  const dialogElement = buildElementTree({
    type: 'dialog',
    attributes: { class: 'settings-dialog' },
    children: [settingsTitle, playerInfoInputContainer, boardSettingsContainer, settingsButtonsContainer]
  });

  addPlayersTypeSelectListeners(dialogElement, ['player-one', 'player-two']);
  addChangeDifficultySelectListeners(dialogElement, ['player-one', 'player-two']);
  addButtonListeners(
    dialogElement,
    '.settings-submit-button',
    '.settings-cancel-button',
    '.settings-submit-disclaimer',
    ['player-one', 'player-two']
  );
  addRestrictNumberInputsListener(dialogElement.querySelectorAll('input[type="number"]'));

  return dialogElement;
}
