import { COMMON_ELEMENTS, STRUCTURAL_ELEMENTS } from '../../../../Utility/constants/dom/elements';
import {
  buildElementFromUIObj,
  buildUIObj,
  wrap,
  buildParagraphObj,
  buildButtonObj
} from '../../../../Utility/uiBuilderUtils/uiBuilders';
import { INSTRUCTIONS_DIALOG, INSTRUCTION_BUTTONS } from './constants';
import { BASE_CLASSES } from '../../../../Utility/constants/dom/baseStyles';

const buildInstructionButtonsObj = () =>
  wrap(INSTRUCTION_BUTTONS.CONTAINER_CLASS, [
    buildButtonObj(
      INSTRUCTION_BUTTONS.PLACEMENT.TEXT,
      `${INSTRUCTION_BUTTONS.PLACEMENT.CLASS} ${BASE_CLASSES.BUTTON}`
    ),
    buildButtonObj(
      INSTRUCTION_BUTTONS.COMBAT.TEXT,
      `${INSTRUCTION_BUTTONS.COMBAT.CLASS} ${BASE_CLASSES.BUTTON}`
    ),
    buildButtonObj(
      INSTRUCTION_BUTTONS.SETTINGS.TEXT,
      `${INSTRUCTION_BUTTONS.SETTINGS.CLASS} ${BASE_CLASSES.BUTTON}`
    )
  ]);
const buildCloseButtonObj = () =>
  buildButtonObj(
    INSTRUCTIONS_DIALOG.CLOSE_BUTTON.TEXT,
    `${INSTRUCTIONS_DIALOG.CLOSE_BUTTON.CLASS} ${BASE_CLASSES.BUTTON}`
  );

const buildHeaderObj = () =>
  wrap(INSTRUCTIONS_DIALOG.HEADER.WRAPPER_CLASS, [
    buildParagraphObj(INSTRUCTIONS_DIALOG.HEADER.TEXT, INSTRUCTIONS_DIALOG.HEADER.CLASS),
    buildCloseButtonObj()
  ]);

const buildContentContainerObj = () =>
  buildUIObj(COMMON_ELEMENTS.DIV, {
    attributes: { class: INSTRUCTIONS_DIALOG.CONTENT_CONTAINER_CLASS }
  });

export const buildInstructionsDialogElement = () => {
  const dialogHeader = buildHeaderObj();
  const instructionButtons = buildInstructionButtonsObj();
  const contentContainer = buildContentContainerObj();
  const uiObj = buildUIObj(STRUCTURAL_ELEMENTS.DIALOG, {
    attributes: { class: INSTRUCTIONS_DIALOG.CLASS },
    children: [dialogHeader, instructionButtons, contentContainer]
  });

  return buildElementFromUIObj(uiObj);
};
