import { MOUSE_EVENTS } from '../../../Utility/constants/dom/domEvents';
import { buildGameOverDialogElement } from './buildGameOverDialogElement';
import { ListenerManager } from '../../../Utility/uiBuilderUtils/ListenerManager';

export const GameOverDialogView = () => {
  const { dialogElement, playAgainBtn, closeButton, winnerNameElement, winnerMessageElement } =
    buildGameOverDialogElement();

  const listenerManager = ListenerManager();
  let container = document.querySelector('body');
  let winnerName = 'k';
  let winnerMessage = ` Wins!`;

  const setContainer = (newContainer) => {
    if (!(newContainer && newContainer instanceof HTMLElement))
      throw new Error(`Invalid Container: ${newContainer}`);
    container = newContainer;
  };

  const listenerKeys = {
    PLAY_AGAIN: 'playAgain',
    CLOSE: 'closeDialog'
  };

  const onClose = () => {
    listenerManager.disableAllListeners();
    dialogElement.close();
  };

  listenerManager.addController({
    element: closeButton,
    event: MOUSE_EVENTS.CLICK,
    callback: onClose,
    key: listenerKeys.CLOSE,
    enable: true
  });

  const setOnPlayAgain = (playAgainFn) => {
    const onPlayAgain = () => {
      playAgainFn();
      dialogElement.close();
    };
    listenerManager.addController({
      element: playAgainBtn,
      event: MOUSE_EVENTS.CLICK,
      callback: onPlayAgain,
      key: listenerKeys.PLAY_AGAIN,
      enable: true
    });
  };

  const setText = (playerName) => {
    winnerNameElement.textContent = playerName;
    winnerMessageElement.textContent = winnerMessage;
  };

  const display = (playerName = winnerName, newContainer = null) => {
    if (newContainer) setContainer(newContainer);
    if (!container) throw new Error('Cannot display dialog without a container.');
    container.append(dialogElement);
    setText(playerName);
    listenerManager.enableAllListeners();
    dialogElement.showModal();
  };
  return {
    setWinnerName: (newName) => (winnerName = newName),
    setWinnerMessage: (message) => (winnerMessage = message),
    setContainer,
    setOnPlayAgain,
    display
  };
};
