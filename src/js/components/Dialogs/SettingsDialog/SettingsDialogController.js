import { GAME_EVENTS } from '../../../utility/constants/events';
import eventEmitter from '../../../utility/events/eventEmitter';
import { SettingsDialogModel } from './model/SettingsDialogModel';
import { SettingsDialogView } from './view/SettingsDialogView';

export const SettingsDialogController = () => {
  const model = SettingsDialogModel();
  const view = SettingsDialogView();
  const onSubmit = (data) => {
    const { p1Settings, p2Settings, boardSettings } = data;
    model.updateSettings({ p1Settings, p2Settings, boardSettings });
    eventEmitter.publish(GAME_EVENTS.SETTINGS_SUBMITTED, data);
  };
  view.setOnSubmit(onSubmit);
  return {
    getCurrentSettings: () => model.getSettings(),
    setContainer: (container) => view.setContainer(container),
    display: () => view.display()
  };
};