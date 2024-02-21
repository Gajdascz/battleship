import { buildInstructionsDialogElement } from './utility/buildInstructionsDialogElement';
import { initializeListenerManager } from './utility/initializeListenerManager';

export const InstructionsDialogView = () => {
  const dialogElement = buildInstructionsDialogElement();
  const listenerManager = initializeListenerManager(dialogElement);

  const container = { current: null };
  const setContainer = (newContainer) => {
    if (!(newContainer && newContainer instanceof HTMLElement))
      throw new Error(`Invalid Container: ${newContainer}`);
    container.current = newContainer;
  };
  const display = (newContainer = null) => {
    if (newContainer) setContainer(newContainer);
    if (!container.current) throw new Error('Cannot display dialog without a container.');
    container.current.append(dialogElement);
    listenerManager.enableAllListeners();
    dialogElement.showModal();
  };
  return {
    setContainer,
    display
  };
};
