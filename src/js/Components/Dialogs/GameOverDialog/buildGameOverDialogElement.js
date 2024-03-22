import { BASE_CLASSES } from '../../../Utility/constants/dom/baseStyles';
import { STRUCTURAL_ELEMENTS } from '../../../Utility/constants/dom/elements';
import {
  buildButtonObj,
  buildElementFromUIObj,
  buildParagraphObj,
  buildSpanObj,
  buildUIObj,
  wrap
} from '../../../Utility/uiBuilderUtils/uiBuilders';
import { BASE_DIALOG_CLASSES } from '../common/dialogClassConstants';

export const CONSTANTS = {
  CLASSES: {
    DIALOG: 'game-over-dialog',
    HEADER: 'game-over-dialog-header',
    HEADER_MESSAGE_WRAPPER: 'game-over-dialog-header-message-wrapper',
    WINNER_NAME: 'game-winner-name',
    WINNER_MESSAGE: 'winner-message',
    BUTTON_CONTAINER: 'game-over-button-container',
    PLAY_AGAIN_BUTTON: 'play-again-button',
    CLOSE_BUTTON: 'close-this-dialog-button',
    SETTINGS_BUTTON: 'game-over-settings-button'
  },
  TEXTS: {
    WINNER: ` Wins!`,
    PLAY_AGAIN_BUTTON: 'Play Again',
    CLOSE_BUTTON: 'Close',
    SETTINGS: 'Open Settings'
  },
  EVENTS: {
    RESTART: 'gameRestarted'
  }
};

const buildHeaderObj = () =>
  wrap(CONSTANTS.CLASSES.HEADER, [
    wrap(CONSTANTS.CLASSES.HEADER_MESSAGE_WRAPPER, [
      buildSpanObj('', `${CONSTANTS.CLASSES.WINNER_NAME} ${BASE_DIALOG_CLASSES.WHITE_UNDERLINE}`),
      buildSpanObj('', CONSTANTS.CLASSES.WINNER_MESSAGE)
    ]),
    buildButtonObj(
      CONSTANTS.TEXTS.CLOSE_BUTTON,
      `${CONSTANTS.CLASSES.CLOSE_BUTTON} ${BASE_CLASSES.BUTTON}`
    )
  ]);

const buildButtonsObj = () =>
  wrap(CONSTANTS.CLASSES.BUTTON_CONTAINER, [
    buildButtonObj(
      CONSTANTS.TEXTS.PLAY_AGAIN_BUTTON,
      `${CONSTANTS.CLASSES.PLAY_AGAIN_BUTTON} ${BASE_CLASSES.BUTTON}`
    ),

    buildButtonObj(
      CONSTANTS.TEXTS.SETTINGS,
      `${CONSTANTS.CLASSES.SETTINGS_BUTTON} ${BASE_CLASSES.BUTTON}`
    )
  ]);

export const buildGameOverDialogElement = () => {
  const dialogObj = buildUIObj(STRUCTURAL_ELEMENTS.DIALOG, {
    attributes: { class: `${CONSTANTS.CLASSES.DIALOG} ${BASE_DIALOG_CLASSES.DIALOG}` },
    children: [buildHeaderObj(), buildButtonsObj()]
  });

  const dialogElement = buildElementFromUIObj(dialogObj);

  const closeButton = dialogElement.querySelector(`.${CONSTANTS.CLASSES.CLOSE_BUTTON}`);
  const playAgainBtn = dialogElement.querySelector(`.${CONSTANTS.CLASSES.PLAY_AGAIN_BUTTON}`);
  const openSettingsBtn = dialogElement.querySelector(`.${CONSTANTS.CLASSES.SETTINGS_BUTTON}`);
  const winnerNameElement = dialogElement.querySelector(`.${CONSTANTS.CLASSES.WINNER_NAME}`);
  const winnerMessageElement = dialogElement.querySelector(`.${CONSTANTS.CLASSES.WINNER_MESSAGE}`);

  return {
    dialogElement,
    closeButton,
    playAgainBtn,
    openSettingsBtn,
    winnerNameElement,
    winnerMessageElement
  };
};
