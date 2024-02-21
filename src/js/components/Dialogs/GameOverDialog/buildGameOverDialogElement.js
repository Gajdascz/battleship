import { BASE_CLASSES } from '../../../utility/constants/dom/baseStyles';
import { STRUCTURAL_ELEMENTS } from '../../../utility/constants/dom/elements';
import {
  buildButtonObj,
  buildElementFromUIObj,
  buildParagraphObj,
  buildSpanObj,
  buildUIObj,
  wrap
} from '../../../utility/uiBuilderUtils/uiBuilders';
import { BASE_DIALOG_CLASSES } from '../common/dialogClassConstants';

export const CONSTANTS = {
  CLASSES: {
    DIALOG: 'game-over-dialog',
    HEADER: 'game-over-dialog-header',
    WINNER_NAME: 'game-winner-name',
    WINNER_MESSAGE: 'winner-message',
    BUTTON_CONTAINER: 'game-over-button-container',
    PLAY_AGAIN_BUTTON: 'play-again-button',
    CLOSE_BUTTON: 'close-this-dialog-button'
  },
  TEXTS: {
    WINNER: ` Wins!`,
    PLAY_AGAIN_BUTTON: 'Play Again',
    CLOSE_BUTTON: 'Close Dialog'
  },
  EVENTS: {
    RESTART: 'gameRestarted'
  }
};

const buildHeaderObj = () => {
  const header = buildParagraphObj('', `${CONSTANTS.CLASSES.HEADER} ${BASE_DIALOG_CLASSES.TITLE}`);
  const winnerName = buildSpanObj(
    '',
    `${CONSTANTS.CLASSES.WINNER_NAME} ${BASE_DIALOG_CLASSES.NAVY_UNDERLINE}`
  );
  const winnerMessage = buildSpanObj('', CONSTANTS.CLASSES.WINNER_MESSAGE);
  header.children = [winnerName, winnerMessage];
  return header;
};

const buildButtonsObj = () =>
  wrap(CONSTANTS.CLASSES.BUTTON_CONTAINER, [
    buildButtonObj(
      CONSTANTS.TEXTS.PLAY_AGAIN_BUTTON,
      `${CONSTANTS.CLASSES.PLAY_AGAIN_BUTTON} ${BASE_CLASSES.BUTTON}`
    ),
    buildButtonObj(
      CONSTANTS.TEXTS.CLOSE_BUTTON,
      `${CONSTANTS.CLASSES.CLOSE_BUTTON} ${BASE_CLASSES.BUTTON}`
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
  const winnerNameElement = dialogElement.querySelector(`.${CONSTANTS.CLASSES.WINNER_NAME}`);
  const winnerMessageElement = dialogElement.querySelector(`.${CONSTANTS.CLASSES.WINNER_MESSAGE}`);

  return {
    dialogElement,
    closeButton,
    playAgainBtn,
    winnerNameElement,
    winnerMessageElement
  };
};
