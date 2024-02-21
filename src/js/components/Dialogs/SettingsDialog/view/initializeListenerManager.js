import { ListenerManager } from '../../../../utility/uiBuilderUtils/ListenerManager';
import { GENERAL, PLAYER_SETTINGS, SELECTIONS, INPUT_FIELDS, BUTTONS } from '../utility/constants';
import { GENERAL_EVENTS, MOUSE_EVENTS } from '../../../../utility/constants/events';
import { PLAYERS } from '../../../../utility/constants/common';

const getElements = (element) => {
  const p1TypeSelect = element.querySelector(
    `#${SELECTIONS.PLAYER_TYPE.PLAYER_TYPE_CLASS(PLAYER_SETTINGS.PLAYER_ONE.ID)}`
  );
  const p1UsernameInput = element.querySelector(
    `.${INPUT_FIELDS.TEXT_NAME(PLAYER_SETTINGS.PLAYER_ONE.ID).CLASS}`
  );
  const p2TypeSelect = element.querySelector(
    `#${SELECTIONS.PLAYER_TYPE.PLAYER_TYPE_CLASS(PLAYER_SETTINGS.PLAYER_TWO.ID)}`
  );
  const p2UsernameInput = element.querySelector(
    `.${INPUT_FIELDS.TEXT_NAME(PLAYER_SETTINGS.PLAYER_TWO.ID).CLASS}`
  );
  const p2DifficultySelect = element.querySelector(
    `#${SELECTIONS.DIFFICULTY.ATTRIBUTES.ID(PLAYER_SETTINGS.PLAYER_TWO.ID)}`
  );
  const rowsInput = element.querySelector(`.${INPUT_FIELDS.DIMENSIONS.CLASSES.ROWS_INPUT}`);
  const colsInput = element.querySelector(`.${INPUT_FIELDS.DIMENSIONS.CLASSES.COLS_INPUT}`);
  const letterAxisInput = element.querySelector(`#${SELECTIONS.LETTER_AXIS.ATTRIBUTES.ID}`);

  const submitButton = element.querySelector(`.${BUTTONS.SUBMIT.CLASS}`);
  const cancelButton = element.querySelector(`.${BUTTONS.CANCEL.CLASS}`);
  return {
    p1TypeSelect,
    p1UsernameInput,
    p2TypeSelect,
    p2UsernameInput,
    p2DifficultySelect,
    rowsInput,
    colsInput,
    letterAxisInput,
    submitButton,
    cancelButton
  };
};

const EVENT_CONTROLLER_KEYS = {
  P2_DYNAMIC_DIFFICULTY: 'p2DynamicDifficulty',
  ROW_RESTRICTION: 'rowRestriction',
  COL_RESTRICTION: 'colRestriction',
  PREVENT_ESCAPE: 'preventEscape',
  P2_TYPE_UPDATE: 'p2TypeUpdate',
  SUBMIT: 'submit',
  CANCEL: 'cancel'
};
export const initializeListenerManager = (element, onSubmitCallback = null) => {
  if (!(element && element instanceof HTMLElement)) throw new Error(`Invalid Element: ${element}`);
  const listenerManager = ListenerManager();
  const {
    p1TypeSelect,
    p1UsernameInput,
    p2TypeSelect,
    p2UsernameInput,
    p2DifficultySelect,
    rowsInput,
    colsInput,
    letterAxisInput,
    submitButton,
    cancelButton
  } = getElements(element);
  const onSubmit = { callback: onSubmitCallback };
  const setOnSubmit = (callback) => (onSubmit.callback = callback);

  /**
   * Provides color representation of selected difficulty.
   */
  const setColorCallback = () => {
    if (p2DifficultySelect.value === SELECTIONS.DIFFICULTY.OPTIONS[0].value) {
      p2DifficultySelect.classList.add(SELECTIONS.DIFFICULTY.OPTIONS[0].id);
      p2DifficultySelect.classList.remove(SELECTIONS.DIFFICULTY.OPTIONS[1].id);
      p2DifficultySelect.classList.remove(SELECTIONS.DIFFICULTY.OPTIONS[2].id);
    } else if (p2DifficultySelect.value === SELECTIONS.DIFFICULTY.OPTIONS[1].value) {
      p2DifficultySelect.classList.remove(SELECTIONS.DIFFICULTY.OPTIONS[0].id);
      p2DifficultySelect.classList.add(SELECTIONS.DIFFICULTY.OPTIONS[1].id);
      p2DifficultySelect.classList.remove(SELECTIONS.DIFFICULTY.OPTIONS[2].id);
    } else {
      p2DifficultySelect.classList.remove(SELECTIONS.DIFFICULTY.OPTIONS[0].id);
      p2DifficultySelect.classList.remove(SELECTIONS.DIFFICULTY.OPTIONS[1].id);
      p2DifficultySelect.classList.add(SELECTIONS.DIFFICULTY.OPTIONS[2].id);
    }
  };
  /**
   * Dynamically updates P2's information inputs based on selected type.
   * If human removes difficulty and adds username and vice versa.
   */
  const updateP2TypeOnChange = () => {
    const type = p2TypeSelect.value;
    if (type === SELECTIONS.PLAYER_TYPE.TYPES.HUMAN) {
      p2UsernameInput.classList.remove(GENERAL.CLASSES.HIDE);
      p2DifficultySelect.classList.add(GENERAL.CLASSES.HIDE);
      listenerManager.disableListener(EVENT_CONTROLLER_KEYS.P2_DYNAMIC_DIFFICULTY);
    } else {
      p2UsernameInput.classList.add(GENERAL.CLASSES.HIDE);
      p2DifficultySelect.classList.remove(GENERAL.CLASSES.HIDE);
      listenerManager.enableListener(EVENT_CONTROLLER_KEYS.P2_DYNAMIC_DIFFICULTY);
    }
  };
  /**
   * Ensures row input can not exceed the games set maximum.
   */
  const enforceRowMax = () => {
    if (rowsInput.value > 26) rowsInput.value = 26;
  };
  /**
   * Ensures column input can not exceed the games set maximum.
   */
  const enforceColMax = () => {
    if (colsInput.value > 26) colsInput.value = 26;
  };

  /**
   * Retrieves relevant P2 data based on selected type.
   * @returns {Object} Object containing P2 specific data.
   */
  const getP2Info = () =>
    p2TypeSelect.value === SELECTIONS.PLAYER_TYPE.TYPES.COMPUTER
      ? { difficulty: p2DifficultySelect.value }
      : { username: p2UsernameInput.value };

  /**
   * Extracts and returns all settings data from configuration.
   * @returns {Object} Contains all setting configuration information
   */
  const getInputValues = () => ({
    p1Settings: {
      type: p1TypeSelect.value,
      username: p1UsernameInput.value,
      id: PLAYERS.IDS.P1
    },
    p2Settings: {
      type: p2TypeSelect.value,
      ...getP2Info(),
      id: PLAYERS.IDS.P2
    },
    boardSettings: {
      numberOfRows: rowsInput.value,
      numberOfCols: colsInput.value,
      letterAxis: letterAxisInput.value
    }
  });

  /**
   * Disables all listeners, closes the dialog, and removes the element.
   */
  const closeDialog = () => {
    listenerManager.disableAllListeners();
    element.close();
    element.remove();
  };

  // difficultySelect
  listenerManager.addController({
    element: p2DifficultySelect,
    event: GENERAL_EVENTS.CHANGE,
    callback: setColorCallback,
    key: EVENT_CONTROLLER_KEYS.P2_DYNAMIC_DIFFICULTY
  });
  // rowRestriction
  listenerManager.addController({
    element: rowsInput,
    event: GENERAL_EVENTS.CHANGE,
    callback: enforceRowMax,
    key: EVENT_CONTROLLER_KEYS.ROW_RESTRICTION
  });
  // colRestriction
  listenerManager.addController({
    element: colsInput,
    event: GENERAL_EVENTS.CHANGE,
    callback: enforceColMax,
    key: EVENT_CONTROLLER_KEYS.COL_RESTRICTION
  });
  // updateP2TypeOnChange
  listenerManager.addController({
    element: p2TypeSelect,
    event: GENERAL_EVENTS.CHANGE,
    callback: updateP2TypeOnChange,
    key: EVENT_CONTROLLER_KEYS.P2_TYPE_UPDATE
  });
  // getInputValues
  listenerManager.addController({
    element: submitButton,
    event: MOUSE_EVENTS.CLICK,
    callback: () => {
      if (onSubmit.callback) {
        const data = getInputValues();
        onSubmit.callback(data);
      }
      closeDialog();
    },
    key: EVENT_CONTROLLER_KEYS.SUBMIT
  });
  // closeOnCancel
  listenerManager.addController({
    element: cancelButton,
    event: MOUSE_EVENTS.CLICK,
    callback: closeDialog,
    key: EVENT_CONTROLLER_KEYS.CANCEL
  });
  setColorCallback();
  return { listenerManager, setOnSubmit };
};
