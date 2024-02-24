import { BASE_CLASSES } from '../../../utility/constants/dom/baseStyles';
import { STRUCTURAL_ELEMENTS } from '../../../utility/constants/dom/elements';

import {
  buildParagraphObj,
  buildSpanObj,
  buildButtonObj,
  buildUIObj,
  buildElementFromUIObj
} from '../../../utility/uiBuilderUtils/uiBuilders';
import { BASE_DIALOG_CLASSES } from '../common/dialogClassConstants';

const buildHeaderObj = () => {
  const header = buildParagraphObj('', `${BASE_DIALOG_CLASSES.HEADER_PRIMARY}`);
  const playerNameObj = buildSpanObj('', `next-player-name ${BASE_DIALOG_CLASSES.GREEN_UNDERLINE}`);
  header.children = [playerNameObj];
  return header;
};
const buildProceedButtonObj = () =>
  buildButtonObj('Proceed', `proceed-to-next-player-button ${BASE_CLASSES.BUTTON}`);

export const buildAlternatePlayerDialogElement = () => {
  const headerObj = buildHeaderObj();
  const proceedButtonObj = buildProceedButtonObj();
  const dialogObj = buildUIObj(STRUCTURAL_ELEMENTS.DIALOG, {
    attributes: { class: `alternate-player-dialog ${BASE_DIALOG_CLASSES.DIALOG}` },
    children: [headerObj, proceedButtonObj]
  });
  const dialogElement = buildElementFromUIObj(dialogObj);
  const playerNameElement = dialogElement.querySelector('.next-player-name');
  const proceedButtonElement = dialogElement.querySelector('.proceed-to-next-player-button');
  return {
    dialogElement,
    playerNameElement,
    proceedButtonElement
  };
};
