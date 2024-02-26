import { MOUSE_EVENTS } from '../../../Utility/constants/dom/domEvents';
import { buildGameOverDialogElement } from './buildGameOverDialogElement';

export const GameOverDialogView = (restartCallback) => {
  const { dialogElement, playAgainBtn, closeButton, winnerNameElement, winnerMessageElement } =
    buildGameOverDialogElement();
  const container = { current: null };
  let winnerMessage = ` Wins!`;
  const closeDialog = () => {
    playAgainBtn.removeEventListener(MOUSE_EVENTS.CLICK, restartCallback);
    closeButton.removeEventListener(MOUSE_EVENTS.CLICK, dialogElement.showModal);
    dialogElement.close();
  };

  const setContainer = (newContainer) => {
    if (!(newContainer && newContainer instanceof HTMLElement))
      throw new Error(`Invalid Container: ${newContainer}`);
    container.current = newContainer;
  };

  const display = (playerName, newContainer = null) => {
    if (newContainer) setContainer(newContainer);
    if (!container.current) throw new Error('Cannot display dialog without a container.');
    container.current.append(dialogElement);
    winnerNameElement.textContent = playerName;
    winnerMessageElement.textContent = winnerMessage;
    playAgainBtn.addEventListener(MOUSE_EVENTS.CLICK, restartCallback);
    closeButton.addEventListener(MOUSE_EVENTS.CLICK, closeDialog);
    dialogElement.showModal();
  };
  return {
    setWinnerMessage: (message) => (winnerMessage = message),
    setContainer,
    display
  };
};
