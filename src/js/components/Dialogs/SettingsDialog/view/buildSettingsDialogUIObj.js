import { buildElementFromUIObj, buildUIObj } from '../../../../utility/uiBuilderUtils/uiBuilders';
import { COMMON_ELEMENTS, STRUCTURAL_ELEMENTS } from '../../../../utility/constants/dom/elements';

import {
  GENERAL,
  SELECTIONS,
  BUTTONS,
  INPUT_FIELDS,
  PLAYER_SETTINGS,
  BOARD_SETTINGS
} from '../utility/constants';
import { KEY_EVENTS, MOUSE_EVENTS } from '../../../../utility/constants/events';

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

export const buildSettingsDialogUIObj = () => {
  const title = buildParagraphObj(GENERAL.TEXTS.DIALOG_TITLE, GENERAL.CLASSES.DIALOG_TITLE);
  const playerInfoInputs = buildPlayerInfoInputObj();
  const boardSettings = buildBoardSettingsInputsObj();
  const buttons = buildSettingsButtonsObj();
  const settingsDialogUIObj = buildUIObj(STRUCTURAL_ELEMENTS.DIALOG, {
    attributes: { class: GENERAL.CLASSES.DIALOG },
    children: [title, playerInfoInputs, boardSettings, buttons]
  });
  const dialogElement = buildElementFromUIObj(settingsDialogUIObj);

  const p1TypeSelect = dialogElement.querySelector(
    `#${SELECTIONS.PLAYER_TYPE.PLAYER_TYPE_CLASS(PLAYER_SETTINGS.PLAYER_ONE.ID)}`
  );
  const p1UsernameInput = dialogElement.querySelector(
    `.${INPUT_FIELDS.TEXT_NAME(PLAYER_SETTINGS.PLAYER_ONE.ID).CLASS}`
  );
  const p2TypeSelect = dialogElement.querySelector(
    `#${SELECTIONS.PLAYER_TYPE.PLAYER_TYPE_CLASS(PLAYER_SETTINGS.PLAYER_TWO.ID)}`
  );
  const p2UsernameInput = dialogElement.querySelector(
    `.${INPUT_FIELDS.TEXT_NAME(PLAYER_SETTINGS.PLAYER_TWO.ID).CLASS}`
  );
  const p2DifficultySelect = dialogElement.querySelector(
    `#${SELECTIONS.DIFFICULTY.ATTRIBUTES.ID(PLAYER_SETTINGS.PLAYER_TWO.ID)}`
  );
  const rowsInput = dialogElement.querySelector(`.${INPUT_FIELDS.DIMENSIONS.CLASSES.ROWS_INPUT}`);
  const colsInput = dialogElement.querySelector(`.${INPUT_FIELDS.DIMENSIONS.CLASSES.COLS_INPUT}`);
  const letterAxisInput = dialogElement.querySelector(`#${SELECTIONS.LETTER_AXIS.ATTRIBUTES.ID}`);

  const submitButton = dialogElement.querySelector(`.${BUTTONS.SUBMIT.CLASS}`);
  const cancelButton = dialogElement.querySelector(`.${BUTTONS.CANCEL.CLASS}`);

  const setColorCallback = () => {
    if (p2TypeSelect.value === SELECTIONS.DIFFICULTY.OPTIONS[0].value) {
      p2TypeSelect.classList.add(SELECTIONS.DIFFICULTY.OPTIONS[0].id);
      p2TypeSelect.classList.remove(SELECTIONS.DIFFICULTY.OPTIONS[1].id);
      p2TypeSelect.classList.remove(SELECTIONS.DIFFICULTY.OPTIONS[2].id);
    } else if (p2TypeSelect.value === SELECTIONS.DIFFICULTY.OPTIONS[1].value) {
      p2TypeSelect.classList.remove(SELECTIONS.DIFFICULTY.OPTIONS[0].id);
      p2TypeSelect.classList.add(SELECTIONS.DIFFICULTY.OPTIONS[1].id);
      p2TypeSelect.classList.remove(SELECTIONS.DIFFICULTY.OPTIONS[2].id);
    } else {
      p2TypeSelect.classList.remove(SELECTIONS.DIFFICULTY.OPTIONS[0].id);
      p2TypeSelect.classList.remove(SELECTIONS.DIFFICULTY.OPTIONS[1].id);
      p2TypeSelect.classList.add(SELECTIONS.DIFFICULTY.OPTIONS[2].id);
    }
  };
  const updateP2TypeOnChange = () => {
    const type = p2TypeSelect.value;
    if (type === SELECTIONS.PLAYER_TYPE.TYPES.HUMAN) {
      p2UsernameInput.classList.remove(GENERAL.CLASSES.HIDE);
      p2DifficultySelect.classList.add(GENERAL.CLASSES.HIDE);
      listeners.p2DynamicDifficulty.disable();
    } else {
      p2UsernameInput.classList.add(GENERAL.CLASSES.HIDE);
      p2DifficultySelect.classList.remove(GENERAL.CLASSES.HIDE);
      listeners.p2DifficultySelect.enable();
    }
  };
  const enforceRowMax = () => {
    if (rowsInput.value > 26) rowsInput.value = 26;
  };
  const enforceColMax = () => {
    if (colsInput.value > 26) colsInput.value = 26;
  };
  const preventEscape = (e) => {
    if (e.key === KEY_EVENTS.CODES.ESC) {
      e.preventDefault();
    }
  };
  const getP2Info = () =>
    p2TypeSelect.value === SELECTIONS.PLAYER_TYPE.TYPES.COMPUTER
      ? { difficulty: p2DifficultySelect.value }
      : { username: p2UsernameInput.value };

  const getInputValues = () => ({
    p1: {
      type: p1TypeSelect.value,
      username: p1UsernameInput.value
    },
    p2: {
      type: p2TypeSelect.value,
      ...getP2Info()
    },
    rows: rowsInput.value,
    cols: colsInput.value,
    letterAxis: letterAxisInput.value
  });

  const closeOnCancel = () => dialogElement.close();

  const createListenerManager = (element, event, callback, id) => {
    let isActive = false;
    return {
      enable: () => {
        if (isActive) return;
        element.addEventListener(event, callback);
        isActive = true;
      },
      disable: () => {
        if (!isActive) return;
        element.removeEventListener(event, callback);
        isActive = false;
      },
      id
    };
  };

  const listeners = {
    activeListeners: {},
    p2DynamicDifficulty: createListenerManager(
      p2DifficultySelect,
      'change',
      setColorCallback,
      'difficultySelect'
    ),
    rowRestriction: createListenerManager(rowsInput, 'change', enforceRowMax, 'rowMax'),
    colRestriction: createListenerManager(colsInput, 'change', enforceColMax, 'colMax'),
    preventEscape: createListenerManager(
      dialogElement,
      KEY_EVENTS.DOWN,
      preventEscape,
      'preventEscape'
    ),
    p2TypeUpdate: createListenerManager(
      p2TypeSelect,
      'change',
      updateP2TypeOnChange,
      'p2TypeUpdate'
    ),
    submit: createListenerManager(submitButton, MOUSE_EVENTS.CLICK, getInputValues, 'submit'),
    cancel: createListenerManager(cancelButton, MOUSE_EVENTS.CLICK, closeOnCancel, 'cancel'),
    enableAll: () => Object.values(listeners).forEach((listener) => listener.enable()),
    disableAll: () => Object.values(listeners).forEach((listener) => listener.disable())
  };

  return {
    appendDialog: (container) => container.append(dialogElement),
    showDialog: () => dialogElement.showModal(),
    listeners
  };
};
