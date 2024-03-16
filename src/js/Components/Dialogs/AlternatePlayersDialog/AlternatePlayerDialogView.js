import { MOUSE_EVENTS } from '../../../Utility/constants/dom/domEvents';
import { buildAlternatePlayerDialogElement } from './buildAlternatePlayerDialogElement';

export const AlternatePlayerDialogView = () => {
  const { dialogElement, proceedButtonElement, playerNameElement } =
    buildAlternatePlayerDialogElement();

  let displayName = null;

  const closeDialog = () => {
    proceedButtonElement.removeEventListener(MOUSE_EVENTS.CLICK, dialogElement.showModal);
    dialogElement.close();
    dialogElement.remove();
  };

  let container = document.querySelector('body');
  const setContainer = (newContainer) => {
    if (!(newContainer && newContainer instanceof HTMLElement))
      throw new Error(`Invalid Container: ${newContainer}`);
    container = newContainer;
  };
  const display = (playerName = displayName, newContainer = null) => {
    if (newContainer) setContainer(newContainer);
    if (!container) throw new Error('Cannot display dialog without a container.');
    container.append(dialogElement);
    playerNameElement.textContent = `${playerName}'s Turn`;
    proceedButtonElement.addEventListener(MOUSE_EVENTS.CLICK, closeDialog);
    dialogElement.showModal();
  };
  return {
    setContainer,
    setPlayerName: (name) => (displayName = name),
    display
  };
};
