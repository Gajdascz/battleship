import { MOUSE_EVENTS } from '../../../utility/constants/events';
import { buildAlternatePlayerDialogElement } from './buildAlternatePlayerDialogElement';

export const AlternatePlayerDialogView = () => {
  const { dialogElement, proceedButtonElement, playerNameElement } =
    buildAlternatePlayerDialogElement();

  const closeDialog = () => {
    proceedButtonElement.removeEventListener(MOUSE_EVENTS.CLICK, dialogElement.showModal);
    dialogElement.close();
  };

  const container = { current: null };
  const setContainer = (newContainer) => {
    if (!(newContainer && newContainer instanceof HTMLElement))
      throw new Error(`Invalid Container: ${newContainer}`);
    container.current = newContainer;
  };
  const display = (playerName, newContainer = null) => {
    if (newContainer) setContainer(newContainer);
    if (!container.current) throw new Error('Cannot display dialog without a container.');
    container.current.append(dialogElement);
    playerNameElement.textContent = `${playerName}'s Turn`;
    proceedButtonElement.addEventListener(MOUSE_EVENTS.CLICK, closeDialog);
    dialogElement.showModal();
  };
  return {
    setContainer,
    display
  };
};
