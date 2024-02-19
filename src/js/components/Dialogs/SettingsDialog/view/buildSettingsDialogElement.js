import {
  GENERAL,
  INPUT_FIELDS,
  SELECTIONS,
  PLAYER_SETTINGS,
  BOARD_SETTINGS,
  BUTTONS
} from '../utility/constants';
import { COMMON_ELEMENTS, STRUCTURAL_ELEMENTS } from '../../../../utility/constants/dom/elements';
import { buildElementFromUIObj, buildUIObj } from '../../../../utility/uiBuilderUtils/uiBuilders';
const wrap = (wrapperClass, uiObjs = []) =>
  buildUIObj(COMMON_ELEMENTS.DIV, { attributes: { class: wrapperClass }, children: uiObjs });
const buildLabelObj = (text, attributes) => buildUIObj(GENERAL.LABEL_ELEMENT, { text, attributes });
const buildParagraphObj = (text, classAttr) =>
  buildUIObj(COMMON_ELEMENTS.PARAGRAPH, { text, attributes: { class: classAttr } });
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
  options.push(humanOption);
  let computerOption = null;
  if (player === PLAYER_SETTINGS.PLAYER_TWO.ID) {
    computerOption = {
      value: SELECTIONS.PLAYER_TYPE.TYPES.COMPUTER,
      text: SELECTIONS.PLAYER_TYPE.TEXTS.COMPUTER,
      isSelected: selected === SELECTIONS.PLAYER_TYPE.TYPES.COMPUTER
    };
    options.push(computerOption);
  }
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
      buildTextUsernameInputObj(PLAYER_SETTINGS.PLAYER_ONE.ID)
    ]),
    wrap(PLAYER_SETTINGS.COMMON_CLASSES.INFO_CONTAINER, [
      buildParagraphObj(PLAYER_SETTINGS.PLAYER_TWO.TITLE, PLAYER_SETTINGS.PLAYER_TWO.TITLE_CLASS),
      buildPlayerTypeSelectInputObj(
        PLAYER_SETTINGS.PLAYER_TWO.ID,
        PLAYER_SETTINGS.PLAYER_TWO.TYPE_DEFAULT
      ),
      buildTextUsernameInputObj(PLAYER_SETTINGS.PLAYER_TWO.ID, true),
      buildDifficultySelectInputObj(PLAYER_SETTINGS.PLAYER_TWO.ID, false)
    ])
  ]);

const buildSettingsButtonsObj = () =>
  wrap(BUTTONS.CONTAINER_CLASS, [
    buildUIObj(COMMON_ELEMENTS.BUTTON, {
      text: BUTTONS.SUBMIT.TEXT,
      attributes: { class: BUTTONS.SUBMIT.CLASS }
    }),
    buildParagraphObj(BUTTONS.SUBMIT.DISCLAIMER.TEXT, BUTTONS.SUBMIT.DISCLAIMER.CLASS),
    buildUIObj(COMMON_ELEMENTS.BUTTON, {
      text: BUTTONS.CANCEL.TEXT,
      attributes: { class: BUTTONS.CANCEL.CLASS }
    })
  ]);
const buildSettingsTitleObj = () =>
  buildParagraphObj(GENERAL.TEXTS.DIALOG_TITLE, GENERAL.CLASSES.DIALOG_TITLE);

export const buildSettingsDialogElement = () => {
  const title = buildSettingsTitleObj();
  const playerInfoInputs = buildPlayerInfoInputObj();
  const boardSettings = buildBoardSettingsInputsObj();
  const buttons = buildSettingsButtonsObj();
  const uiObj = buildUIObj(STRUCTURAL_ELEMENTS.DIALOG, {
    attributes: { class: GENERAL.CLASSES.DIALOG },
    children: [title, playerInfoInputs, boardSettings, buttons]
  });
  return buildElementFromUIObj(uiObj);
};
