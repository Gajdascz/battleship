import { COMMON_ELEMENTS, STRUCTURAL_ELEMENTS } from '../../../utility/constants/dom/elements';
import { buildElementFromUIObj, buildUIObj } from '../../../utility/uiBuilderUtils/uiBuilders';
import { DIALOG_CLASSES } from '../common/constants';
import { BASE_CLASSES } from '../../../utility/constants/dom/baseStyles';
const wrap = (wrapperClass, uiObjs = []) =>
  buildUIObj(COMMON_ELEMENTS.DIV, { attributes: { class: wrapperClass }, children: uiObjs });

const buildParagraphObj = (text, classAttr) =>
  buildUIObj(COMMON_ELEMENTS.PARAGRAPH, { text, attributes: { class: classAttr } });

const buildButtonObj = (text, classAttr) =>
  buildUIObj(COMMON_ELEMENTS.BUTTON, { text, attributes: { class: classAttr } });

const INSTRUCTION_BUTTON_CLASS = (instruction) =>
  `${instruction}-instruction-button ${BASE_CLASSES.BUTTON}`;
const DIALOG = {
  CLASS: `instructions-dialog ${DIALOG_CLASSES.DIALOG}`,
  HEADER: {
    TEXT: 'INSTRUCTIONS',
    CLASS: `${DIALOG_CLASSES.TITLE}`
  },
  BACK_BUTTON: {
    TEXT: 'BACK',
    CLASS: `instructions-back-button ${BASE_CLASSES.BUTTON}`
  },
  CLOSE_BUTTON: {
    TEXT: 'CLOSE',
    CLASS: `instructions-close-button ${BASE_CLASSES.BUTTON}`
  }
};
const INSTRUCTION_BUTTONS = {
  CONTAINER_CLASS: 'instructions-button-container',
  PLACEMENT: {
    TEXT: 'Placement',
    CLASS: INSTRUCTION_BUTTON_CLASS('placement')
  },
  COMBAT: {
    TEXT: 'Combat',
    CLASS: INSTRUCTION_BUTTON_CLASS('combat')
  },
  SETTINGS_OPTIONS: {
    TEXT: 'Settings Options',
    CLASS: INSTRUCTION_BUTTON_CLASS('settings-options')
  }
};

const buildHeaderObj = () => buildParagraphObj(DIALOG.HEADER.TEXT, DIALOG.HEADER.CLASS);
const buildInstructionButtonsObj = () =>
  wrap(INSTRUCTION_BUTTONS.CONTAINER_CLASS, [
    buildButtonObj(INSTRUCTION_BUTTONS.PLACEMENT.TEXT, INSTRUCTION_BUTTONS.PLACEMENT.CLASS),
    buildButtonObj(INSTRUCTION_BUTTONS.COMBAT.TEXT, INSTRUCTION_BUTTONS.COMBAT.CLASS),
    buildButtonObj(
      INSTRUCTION_BUTTONS.SETTINGS_OPTIONS.TEXT,
      INSTRUCTION_BUTTONS.SETTINGS_OPTIONS.CLASS
    )
  ]);

const buildCloseButtonObj = () =>
  buildButtonObj(DIALOG.CLOSE_BUTTON.TEXT, DIALOG.CLOSE_BUTTON.CLASS);

export const buildInstructionsDialogElement = () => {
  const dialogHeader = buildHeaderObj();
  const instructionButtons = buildInstructionButtonsObj();
  const closeButton = buildCloseButtonObj();

  const uiObj = buildUIObj(STRUCTURAL_ELEMENTS.DIALOG, {
    attributes: { class: DIALOG.CLASS },
    children: [dialogHeader, instructionButtons, closeButton]
  });
  return buildElementFromUIObj(uiObj);
};
