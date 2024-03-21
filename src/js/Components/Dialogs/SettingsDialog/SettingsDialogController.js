import { SettingsDialogModel } from './SettingsDialogModel';
import { SettingsDialogView } from './view/SettingsDialogView';

/**
 *
 * @returns {Object}
 */
export const SettingsDialogController = () => {
  let handleOnSubmit = null;
  const model = SettingsDialogModel();
  const view = SettingsDialogView();
  const onSubmit = (data) => {
    const { p1Settings, p2Settings, boardSettings } = data;
    model.updateSettings({ p1Settings, p2Settings, boardSettings });
    if (handleOnSubmit) handleOnSubmit(data);
  };
  view.setOnSubmit(onSubmit);
  return {
    getCurrentSettings: () => model.getSettings(),
    setContainer: (container) => view.setContainer(container),
    display: () => view.display(),
    setOnSubmit: (callback) => (handleOnSubmit = callback)
  };
};
