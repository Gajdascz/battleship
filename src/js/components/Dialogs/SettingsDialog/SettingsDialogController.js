import { GAME_EVENTS } from '../../../utility/constants/events';
import eventEmitter from '../../../utility/events/eventEmitter';
import { SettingsDialogModel } from './model/SettingsDialogModel';
import { SettingsDialogView } from './view/SettingsDialogView';

export const SettingsDialogController = () => {
  const model = SettingsDialogModel();
  const view = SettingsDialogView();
  const onSubmit = (data) => {
    console.log(data);
    const { p1, p2, board } = data;
    model.updateSettings({ p1, p2, board });
    eventEmitter.publish(GAME_EVENTS.SETTINGS_SUBMITTED, data);
  };
  view.setOnSubmit(onSubmit);
  return {
    getCurrentSettings: () => model.getSettings(),
    setContainer: (container) => view.setContainer(container),
    display: () => view.display()
  };
};
