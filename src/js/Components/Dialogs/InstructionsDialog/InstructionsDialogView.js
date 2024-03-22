import { buildInstructionsDialogElement } from './utility/buildInstructionsDialogElement';
import { initializeListenerManager } from './utility/initializeListenerManager';

/**
 * Manages the display and listeners of the Instructions Dialog.
 *
 * @returns {Object} Methods to set the container of and display the dialog.
 */
export const InstructionsDialogView = () => {
  const dialogElement = buildInstructionsDialogElement();
  const listenerManager = initializeListenerManager(dialogElement);

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
    display
  };
};
