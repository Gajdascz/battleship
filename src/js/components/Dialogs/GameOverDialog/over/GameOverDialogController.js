import { ELEMENT_TYPES, GAME_OVER_DIALOG } from '../../common/constants/baseConstants';
import { buildUIObj } from '../../common/utility/uiBuilders';
import { buildElementTree } from '../../common/utility/elementObjBuilder';

/**
 * @module GameOverDialogController.js
 * Factory for creating the Dialog Element and controller for the game-over state.
 * Returns an Object for accessing the Element and getting/setting the winner's name.
 *
 */

/**
 * Creates the structure for the dialog's header Element.
 *
 * @returns {Object} Contains details for the header Element.
 */
const gameOverHeaderObj = () =>
  buildUIObj(ELEMENT_TYPES.PARAGRAPH, {
    attributes: { class: GAME_OVER_DIALOG.CLASSES.HEADER },
    children: [
      buildUIObj(ELEMENT_TYPES.SPAN, {
        attributes: { class: GAME_OVER_DIALOG.CLASSES.WINNER_NAME }
      }),
      buildUIObj(ELEMENT_TYPES.SPAN, {
        attributes: { class: GAME_OVER_DIALOG.CLASSES.WINNER_WINS }
      })
    ]
  });

/**
 * Creates the dialog's button container and button Elements.
 *
 * @returns {Object} Contains details for the buttons container and Elements.
 */
const gameOverButtonsObj = () =>
  buildUIObj(ELEMENT_TYPES.DIV, {
    attributes: { class: GAME_OVER_DIALOG.CLASSES.BUTTON_CONTAINER },
    children: [
      buildUIObj(ELEMENT_TYPES.BUTTON, {
        text: GAME_OVER_DIALOG.TEXTS.PLAY_AGAIN_BUTTON,
        attributes: { class: GAME_OVER_DIALOG.CLASSES.PLAY_AGAIN_BUTTON }
      }),
      buildUIObj(ELEMENT_TYPES.BUTTON, {
        text: GAME_OVER_DIALOG.TEXTS.CLOSE_BUTTON,
        attributes: { class: GAME_OVER_DIALOG.CLASSES.CLOSE_BUTTON }
      })
    ]
  });

/**
 * Creates the structure for building the game over dialog HTML Element.
 *
 * @returns {Object} Contains details and structure for creating dialog HTML Element.
 */
const gameOverDialogObj = () =>
  buildUIObj(ELEMENT_TYPES.DIALOG, {
    attributes: { class: GAME_OVER_DIALOG.CLASSES.DIALOG },
    children: [gameOverHeaderObj(), gameOverButtonsObj()]
  });

/**
 * Creates a controller for the game over dialog.
 * Provides access to the built HTML Element and methods for setting/getting the winner's name.
 *
 * @returns {Object} Contains HTML Element and methods.
 */
export const GameOverDialogController = () => {
  const gameOverDialogElement = buildElementTree(gameOverDialogObj());

  const closeFn = () => gameOverDialogElement.close();

  const closeButton = gameOverDialogElement.querySelector(
    `.${GAME_OVER_DIALOG.CLASSES.CLOSE_BUTTON}`
  );
  const playAgainBtn = gameOverDialogElement.querySelector(
    `.${GAME_OVER_DIALOG.CLASSES.PLAY_AGAIN_BUTTON}`
  );
  const winnerDisplay = gameOverDialogElement.querySelector(
    `.${GAME_OVER_DIALOG.CLASSES.WINNER_NAME}`
  );

  // Cleans up listeners and dispatches gameRestarted event
  const handleRestart = () => {
    closeButton.removeEventListener('click', closeFn);
    playAgainBtn.removeEventListener('click', handleRestart);
    gameOverDialogElement.remove();
    document.dispatchEvent(new CustomEvent(GAME_OVER_DIALOG.EVENTS.RESTART));
  };

  closeButton.addEventListener('click', closeFn);
  playAgainBtn.addEventListener('click', handleRestart);
  return {
    element: gameOverDialogElement,
    get winner() {
      return winnerDisplay.textContent;
    },
    set winner(name) {
      winnerDisplay.textContent = name;
    }
  };
};
