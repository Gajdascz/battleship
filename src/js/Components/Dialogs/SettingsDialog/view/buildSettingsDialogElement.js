import {
  GENERAL,
  INPUT_FIELDS,
  SELECTIONS,
  PLAYER_SETTINGS,
  BOARD_SETTINGS,
  BUTTONS
} from '../constants';
import { STRUCTURAL_ELEMENTS } from '../../../../Utility/constants/dom/elements';
import {
  buildElementFromUIObj,
  buildUIObj,
  wrap,
  buildParagraphObj,
  buildButtonObj
} from '../../../../Utility/uiBuilderUtils/uiBuilders';
import { BASE_CLASSES } from '../../../../Utility/constants/dom/baseStyles';
const buildLabelObj = (text, attributes) => buildUIObj(GENERAL.LABEL_ELEMENT, { text, attributes });

const buildOptionObj = ({ id, value, text, isSelected = false }) =>
  buildUIObj(INPUT_FIELDS.SELECT.OPTION_ELEMENT, {
    id: id ?? value,
    text,
    attributes: { value, ...(isSelected && { selected: '' }) }
  });

const buildSelectInputObj = ({ id, options, hide = false, label = null }) => {
  const optionsObjs = options.map((option) => buildOptionObj(option));
  const children = [...optionsObjs];
  if (label) children.push(label);
  return buildUIObj(INPUT_FIELDS.SELECT.ELEMENT, {
    attributes: {
      id,
      class: `${INPUT_FIELDS.SELECT.INPUT_FIELD_CLASS(id)} ${hide ? GENERAL.CLASSES.HIDE : ''}`
    },
    children
  });
};

const buildHeaderObj = () =>
  wrap(GENERAL.CLASSES.HEADER_WRAPPER, [
    buildParagraphObj(GENERAL.TEXTS.DIALOG_TITLE, GENERAL.CLASSES.DIALOG_TITLE),
    buildButtonObj(
      BUTTONS.INSTRUCTIONS.TEXT,
      `${BUTTONS.INSTRUCTIONS.CLASS} ${BASE_CLASSES.BUTTON}`
    )
  ]);

const buildDifficultySelectInputObj = (player, hide = false) =>
  buildSelectInputObj({
    id: SELECTIONS.DIFFICULTY.ATTRIBUTES.ID(player),
    options: SELECTIONS.DIFFICULTY.OPTIONS,
    hide
  });

const buildTextUsernameInputObj = (player, hide = false) => {
  const details = INPUT_FIELDS.TEXT_NAME(player);
  return buildUIObj(details.ELEMENT, {
    attributes: {
      type: details.ATTRIBUTES.TYPE,
      placeholder: details.ATTRIBUTES.PLACEHOLDER,
      id: details.ATTRIBUTES.ID,
      class: `${details.CLASS} ${hide ? GENERAL.CLASSES.HIDE : ''}`
    }
  });
};

const buildPlayerTypeSelectInputObj = (player, selected) => {
  const options = [];
  const humanOption = {
    value: SELECTIONS.PLAYER_TYPE.TYPES.HUMAN,
    text: SELECTIONS.PLAYER_TYPE.TEXTS.HUMAN,
    isSelected: selected === SELECTIONS.PLAYER_TYPE.TYPES.HUMAN
  };
  const computerOption = {
    value: SELECTIONS.PLAYER_TYPE.TYPES.COMPUTER,
    text: SELECTIONS.PLAYER_TYPE.TEXTS.COMPUTER,
    isSelected: selected === SELECTIONS.PLAYER_TYPE.TYPES.COMPUTER
  };
  options.push(humanOption);
  options.push(computerOption);
  return buildSelectInputObj({ id: SELECTIONS.PLAYER_TYPE.PLAYER_TYPE_CLASS(player), options });
};

const buildLetterAxisSelectObj = () =>
  wrap(SELECTIONS.LETTER_AXIS.CLASSES.WRAPPER, [
    buildSelectInputObj({
      id: SELECTIONS.LETTER_AXIS.ATTRIBUTES.ID,
      options: SELECTIONS.LETTER_AXIS.OPTIONS,
      label: buildLabelObj(SELECTIONS.LETTER_AXIS.TEXTS.LABEL, {
        for: SELECTIONS.LETTER_AXIS.ATTRIBUTES.ID,
        class: SELECTIONS.LETTER_AXIS.CLASSES.LABEL
      })
    }),
    buildLabelObj(SELECTIONS.LETTER_AXIS.TEXTS.LABEL, {
      for: SELECTIONS.LETTER_AXIS.ATTRIBUTES.ID,
      class: SELECTIONS.LETTER_AXIS.CLASSES.LABEL
    })
  ]);

const buildDimensionInputObj = ({ id, classAttr, wrapperClass, labelText, labelClass }) =>
  wrap(wrapperClass, [
    buildUIObj(INPUT_FIELDS.DIMENSIONS.ELEMENT, {
      attributes: {
        type: INPUT_FIELDS.DIMENSIONS.ATTRIBUTES.TYPE,
        min: INPUT_FIELDS.DIMENSIONS.ATTRIBUTES.MIN,
        max: INPUT_FIELDS.DIMENSIONS.ATTRIBUTES.MAX,
        value: INPUT_FIELDS.DIMENSIONS.ATTRIBUTES.MIN,
        id,
        class: classAttr
      }
    }),
    buildLabelObj(labelText, {
      for: id,
      class: labelClass
    })
  ]);

const buildAttackDelayInputObj = (id) =>
  wrap(`${INPUT_FIELDS.ATTACK_DELAY.CLASSES.WRAPPER}`, [
    buildUIObj(INPUT_FIELDS.ATTACK_DELAY.ELEMENT, {
      attributes: {
        type: INPUT_FIELDS.ATTACK_DELAY.ATTRIBUTES.TYPE,
        min: INPUT_FIELDS.ATTACK_DELAY.ATTRIBUTES.MIN,
        value: INPUT_FIELDS.ATTACK_DELAY.ATTRIBUTES.DEFAULT_VALUE,
        id,
        class: INPUT_FIELDS.ATTACK_DELAY.CLASSES.ATTACK_DELAY_INPUT
      }
    }),
    buildLabelObj(INPUT_FIELDS.ATTACK_DELAY.TEXTS.ATTACK_DELAY, {
      for: id,
      class: INPUT_FIELDS.ATTACK_DELAY.CLASSES.LABEL
    })
  ]);

const buildBoardSettingsInputsObj = () =>
  wrap(BOARD_SETTINGS.CLASSES.CONTAINER, [
    buildParagraphObj(BOARD_SETTINGS.TEXTS.TITLE, BOARD_SETTINGS.CLASSES.TITLE),
    wrap(BOARD_SETTINGS.CLASSES.INPUTS_CONTAINER, [
      buildDimensionInputObj({
        id: INPUT_FIELDS.DIMENSIONS.ATTRIBUTES.ROWS_ID,
        classAttr: INPUT_FIELDS.DIMENSIONS.CLASSES.ROWS_INPUT,
        wrapperClass: INPUT_FIELDS.DIMENSIONS.CLASSES.ROWS_INPUT_WRAPPER,
        labelText: INPUT_FIELDS.DIMENSIONS.TEXTS.ROWS,
        labelClass: INPUT_FIELDS.DIMENSIONS.CLASSES.ROWS_INPUT_LABEL
      }),
      buildDimensionInputObj({
        id: INPUT_FIELDS.DIMENSIONS.ATTRIBUTES.COLS_ID,
        classAttr: INPUT_FIELDS.DIMENSIONS.CLASSES.COLS_INPUT,
        wrapperClass: INPUT_FIELDS.DIMENSIONS.CLASSES.COLS_INPUT_WRAPPER,
        labelText: INPUT_FIELDS.DIMENSIONS.TEXTS.COLS,
        labelClass: INPUT_FIELDS.DIMENSIONS.CLASSES.COLS_INPUT_LABEL
      }),
      buildLetterAxisSelectObj()
    ])
  ]);

const buildPlayerInfoInputObj = () =>
  wrap(PLAYER_SETTINGS.COMMON_CLASSES.INFO_INPUT_CONTAINER, [
    wrap(PLAYER_SETTINGS.COMMON_CLASSES.INFO_CONTAINER, [
      buildParagraphObj(PLAYER_SETTINGS.PLAYER_ONE.TITLE, PLAYER_SETTINGS.PLAYER_ONE.TITLE_CLASS),
      buildPlayerTypeSelectInputObj(
        PLAYER_SETTINGS.PLAYER_ONE.ID,
        PLAYER_SETTINGS.PLAYER_ONE.TYPE_DEFAULT
      ),
      buildTextUsernameInputObj(PLAYER_SETTINGS.PLAYER_ONE.ID),
      buildDifficultySelectInputObj(PLAYER_SETTINGS.PLAYER_ONE.ID, true),
      buildAttackDelayInputObj(PLAYER_SETTINGS.PLAYER_ONE.ID)
    ]),
    wrap(PLAYER_SETTINGS.COMMON_CLASSES.INFO_CONTAINER, [
      buildParagraphObj(PLAYER_SETTINGS.PLAYER_TWO.TITLE, PLAYER_SETTINGS.PLAYER_TWO.TITLE_CLASS),
      buildPlayerTypeSelectInputObj(
        PLAYER_SETTINGS.PLAYER_TWO.ID,
        PLAYER_SETTINGS.PLAYER_TWO.TYPE_DEFAULT
      ),
      buildTextUsernameInputObj(PLAYER_SETTINGS.PLAYER_TWO.ID, true),
      buildDifficultySelectInputObj(PLAYER_SETTINGS.PLAYER_TWO.ID, false),
      buildAttackDelayInputObj(PLAYER_SETTINGS.PLAYER_TWO.ID)
    ])
  ]);

const buildSettingsButtonsObj = () =>
  wrap(BUTTONS.CONTAINER_CLASS, [
    buildButtonObj(BUTTONS.SUBMIT.TEXT, `${BUTTONS.SUBMIT.CLASS} ${BASE_CLASSES.BUTTON}`),
    buildParagraphObj(BUTTONS.SUBMIT.DISCLAIMER.TEXT, BUTTONS.SUBMIT.DISCLAIMER.CLASS),
    buildButtonObj(
      BUTTONS.CANCEL.TEXT,
      `${BUTTONS.CANCEL.CLASS} ${BASE_CLASSES.BUTTON} ${GENERAL.CLASSES.HIDE}`
    )
  ]);

export const buildSettingsDialogElement = () => {
  const header = buildHeaderObj();
  const playerInfoInputs = buildPlayerInfoInputObj();
  const boardSettings = buildBoardSettingsInputsObj();
  const buttons = buildSettingsButtonsObj();
  const uiObj = buildUIObj(STRUCTURAL_ELEMENTS.DIALOG, {
    attributes: { class: GENERAL.CLASSES.DIALOG },
    children: [header, playerInfoInputs, boardSettings, buttons]
  });
  return buildElementFromUIObj(uiObj);
};
