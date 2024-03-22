import { SettingsDialogModel } from './SettingsDialogModel';
import { SettingsDialogView } from './view/SettingsDialogView';

/**
 * Handles the submission of game settings, updates the model with new settings,
 * and triggers UI updates.
 *
 * @returns {Object} An interface to manage the settings dialog.
 */
export const SettingsDialogController = () => {
  let handleOnSubmit = null;
  const model = SettingsDialogModel();
  const view = SettingsDialogView();
  const onSubmit = (data) => {
    const { p1Settings, p2Settings, boardSettings } = data;
    model.updateSettings({ p1Settings, p2Settings, boardSettings });
    view.showDisclaimer();
    view.showCloseButton();
    if (handleOnSubmit) handleOnSubmit(data);
  };
  view.setOnSubmit(onSubmit);
  return {
    getCurrentSettings: model.getSettings,
    setContainer: view.setContainer,
    display: view.display,
    setOnSubmit: (callback) => (handleOnSubmit = callback),
    setOpenInstructions: view.setOpenInstructions
  };
};
