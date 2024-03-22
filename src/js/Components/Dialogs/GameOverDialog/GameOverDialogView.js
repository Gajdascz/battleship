import { MOUSE_EVENTS } from '../../../Utility/constants/dom/domEvents';
import { buildGameOverDialogElement } from './buildGameOverDialogElement';
import { ListenerManager } from '../../../Utility/uiBuilderUtils/ListenerManager';
import './game-over-dialog-styles.css';

/**
 * Manages game over dialog display and interactions.
 *
 * @returns {Object} Methods for managing the dialog.
 */
export const GameOverDialogView = () => {
  const {
    dialogElement,
    playAgainBtn,
    closeButton,
    openSettingsBtn,
    winnerNameElement,
    winnerMessageElement
  } = buildGameOverDialogElement();

  const listenerManager = ListenerManager();
  let container = document.querySelector('body');
  let winnerName = '';
  let winnerMessage = ` Wins!`;

  const callbacks = { playAgain: null, openSettings: null };
  const setOnPlayAgain = (callback) => (callbacks.playAgain = callback);
  const setOpenSettings = (callback) => (callbacks.openSettings = callback);

  /**
   * Sets the container to append dialog to.
   */
  const setContainer = (newContainer) => {
    if (!(newContainer && newContainer instanceof HTMLElement))
      throw new Error(`Invalid Container: ${newContainer}`);
    container = newContainer;
  };

  const listenerKeys = {
    PLAY_AGAIN: 'playAgain',
    CLOSE: 'closeDialog',
    OPEN_SETTINGS: 'openSettings'
  };

  /**
   * Disables listeners and closes dialog.
   */
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

  listenerManager.addController({
    element: playAgainBtn,
    event: MOUSE_EVENTS.CLICK,
    callback: () => {
      if (callbacks.playAgain) callbacks.playAgain();
      onClose();
    },
    key: listenerKeys.PLAY_AGAIN,
    enable: true
  });
  listenerManager.addController({
    element: openSettingsBtn,
    event: MOUSE_EVENTS.CLICK,
    callback: () => {
      if (callbacks.openSettings) callbacks.openSettings();
      onClose();
    },
    key: listenerKeys.OPEN_SETTINGS,
    enable: true
  });

  /**
   * Updates the winner name and message elements with provided text.
   *
   * @param {string} playerName Winner's name.
   */
  const setText = (playerName) => {
    winnerNameElement.textContent = playerName;
    winnerMessageElement.textContent = winnerMessage;
  };

  /**
   * Displays the dialog, appending it to the current container and enabling its listeners.
   */
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
    setOpenSettings,
    display
  };
};
