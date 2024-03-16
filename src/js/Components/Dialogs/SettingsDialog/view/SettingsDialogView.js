import { buildSettingsDialogElement } from './buildSettingsDialogElement';
import { initializeListenerManager } from './initializeListenerManager';
import './settings-styles.css';

export const SettingsDialogView = () => {
  const dialogElement = buildSettingsDialogElement();
  const { listenerManager, setOnSubmit } = initializeListenerManager(dialogElement);

  let container = document.querySelector('body');
  const setContainer = (newContainer) => {
    if (!(newContainer && newContainer instanceof HTMLElement))
      throw new Error(`Invalid Container: ${newContainer}`);
    container = newContainer;
  };
  const display = (newContainer = null) => {
    if (newContainer) setContainer(newContainer);
    if (!container) throw new Error('Cannot display dialog without a container.');
    container.append(dialogElement);
    listenerManager.enableAllListeners();
    dialogElement.showModal();
  };

  return {
    setContainer,
    display,
    setOnSubmit: (callback) => setOnSubmit(callback)
  };
};
