import { ListenerManager } from '../../../../Utility/uiBuilderUtils/ListenerManager';
import { GENERAL, PLAYER_SETTINGS, SELECTIONS, INPUT_FIELDS, BUTTONS } from '../constants';
import { GENERAL_EVENTS, MOUSE_EVENTS } from '../../../../Utility/constants/dom/domEvents';
import { PLAYERS } from '../../../../Utility/constants/common';

const getElements = (element) => {
  const p1TypeSelect = element.querySelector(
    `#${SELECTIONS.PLAYER_TYPE.PLAYER_TYPE_CLASS(PLAYER_SETTINGS.PLAYER_ONE.ID)}`
  );
  const p1UsernameInput = element.querySelector(
    `.${INPUT_FIELDS.TEXT_NAME(PLAYER_SETTINGS.PLAYER_ONE.ID).CLASS}`
  );
  const p1DifficultySelect = element.querySelector(
    `#${SELECTIONS.DIFFICULTY.ATTRIBUTES.ID(PLAYER_SETTINGS.PLAYER_ONE.ID)}`
  );
  const p1AttackDelayInput = element.querySelector(
    `.${INPUT_FIELDS.ATTACK_DELAY.CLASSES.ATTACK_DELAY_INPUT}#${PLAYER_SETTINGS.PLAYER_ONE.ID}`
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
  const p2AttackDelayInput = element.querySelector(
    `.${INPUT_FIELDS.ATTACK_DELAY.CLASSES.ATTACK_DELAY_INPUT}#${PLAYER_SETTINGS.PLAYER_TWO.ID}`
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
    p1DifficultySelect,
    p1AttackDelayInput,
    p2AttackDelayInput,
    rowsInput,
    colsInput,
    letterAxisInput,
    submitButton,
    cancelButton
  };
};

const EVENT_CONTROLLER_KEYS = {
  P1_DYNAMIC_DIFFICULTY: 'p1DynamicDifficulty',
  P2_DYNAMIC_DIFFICULTY: 'p2DynamicDifficulty',
  P1_UPDATE_ON_TYPE_CHANGE: 'p1UpdateOnPlayerTypeChange',
  P2_UPDATE_ON_TYPE_CHANGE: 'p2UpdateOnPlayerTypeChange',
  ROW_RESTRICTION: 'rowRestriction',
  COL_RESTRICTION: 'colRestriction',
  PREVENT_ESCAPE: 'preventEscape',
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
    p1DifficultySelect,
    p1AttackDelayInput,
    p2AttackDelayInput,
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
  const setColorCallback = (difficultySelect) => {
    const value = difficultySelect.value;
    const classList = difficultySelect.classList;
    if (value === SELECTIONS.DIFFICULTY.OPTIONS[0].value) {
      classList.add(SELECTIONS.DIFFICULTY.OPTIONS[0].id);
      classList.remove(SELECTIONS.DIFFICULTY.OPTIONS[1].id);
      classList.remove(SELECTIONS.DIFFICULTY.OPTIONS[2].id);
    } else if (value === SELECTIONS.DIFFICULTY.OPTIONS[1].value) {
      classList.remove(SELECTIONS.DIFFICULTY.OPTIONS[0].id);
      classList.add(SELECTIONS.DIFFICULTY.OPTIONS[1].id);
      classList.remove(SELECTIONS.DIFFICULTY.OPTIONS[2].id);
    } else {
      classList.remove(SELECTIONS.DIFFICULTY.OPTIONS[0].id);
      classList.remove(SELECTIONS.DIFFICULTY.OPTIONS[1].id);
      classList.add(SELECTIONS.DIFFICULTY.OPTIONS[2].id);
    }
  };
  const p1SetColorCallback = () => setColorCallback(p1DifficultySelect);
  const p2setColorCallback = () => setColorCallback(p2DifficultySelect);

  /**
   * Dynamically updates P2's information inputs based on selected type.
   * If human removes difficulty and adds username and vice versa.
   */
  const updateOnPlayerTypeChange = ({
    typeSelect,
    usernameInput,
    difficultySelect,
    attackDelayInput,
    dynamicDifficultyKey
  }) => {
    const type = typeSelect.value;
    if (type === SELECTIONS.PLAYER_TYPE.TYPES.HUMAN) {
      usernameInput.classList.remove(GENERAL.CLASSES.HIDE);
      attackDelayInput.parentElement.style.display = 'none';
      difficultySelect.classList.add(GENERAL.CLASSES.HIDE);
      listenerManager.disableListener(dynamicDifficultyKey);
    } else {
      usernameInput.classList.add(GENERAL.CLASSES.HIDE);
      difficultySelect.classList.remove(GENERAL.CLASSES.HIDE);
      attackDelayInput.parentElement.removeAttribute('style');
      listenerManager.enableListener(dynamicDifficultyKey);
    }
  };
  const p1UpdateOnTypeChange = () =>
    updateOnPlayerTypeChange({
      typeSelect: p1TypeSelect,
      usernameInput: p1UsernameInput,
      difficultySelect: p1DifficultySelect,
      attackDelayInput: p1AttackDelayInput,
      key: EVENT_CONTROLLER_KEYS.P1_DYNAMIC_DIFFICULTY
    });
  const p2UpdateOnTypeChange = () =>
    updateOnPlayerTypeChange({
      typeSelect: p2TypeSelect,
      usernameInput: p2UsernameInput,
      difficultySelect: p2DifficultySelect,
      attackDelayInput: p2AttackDelayInput,
      key: EVENT_CONTROLLER_KEYS.P2_DYNAMIC_DIFFICULTY
    });
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
  const getPlayerInfo = ({ typeSelect, difficultySelect, usernameInput, attackDelayInput }) => {
    const type = typeSelect.value;
    return type === SELECTIONS.PLAYER_TYPE.TYPES.COMPUTER
      ? { type, difficulty: difficultySelect.value, attackDelay: attackDelayInput.value }
      : { type, username: usernameInput.value };
  };
  const getP1Info = () =>
    getPlayerInfo({
      typeSelect: p1TypeSelect,
      difficultySelect: p1DifficultySelect,
      usernameInput: p1UsernameInput,
      attackDelayInput: p1AttackDelayInput
    });
  const getP2Info = () =>
    getPlayerInfo({
      typeSelect: p2TypeSelect,
      difficultySelect: p2DifficultySelect,
      usernameInput: p2UsernameInput,
      attackDelayInput: p2AttackDelayInput
    });

  /**
   * Extracts and returns all settings data from configuration.
   * @returns {Object} Contains all setting configuration information
   */
  const getInputValues = () => ({
    p1Settings: {
      ...getP1Info(),
      id: PLAYERS.IDS.P1
    },
    p2Settings: {
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
    element: p1DifficultySelect,
    event: GENERAL_EVENTS.CHANGE,
    callback: p1SetColorCallback,
    key: EVENT_CONTROLLER_KEYS.P1_DYNAMIC_DIFFICULTY
  });
  listenerManager.addController({
    element: p2DifficultySelect,
    event: GENERAL_EVENTS.CHANGE,
    callback: p2setColorCallback,
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
  // updateOnPlayerTypeOnChange
  listenerManager.addController({
    element: p1TypeSelect,
    event: GENERAL_EVENTS.CHANGE,
    callback: p1UpdateOnTypeChange,
    key: EVENT_CONTROLLER_KEYS.P1_UPDATE_ON_TYPE_CHANGE
  });
  listenerManager.addController({
    element: p2TypeSelect,
    event: GENERAL_EVENTS.CHANGE,
    callback: p2UpdateOnTypeChange,
    key: EVENT_CONTROLLER_KEYS.P2_UPDATE_ON_TYPE_CHANGE
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
  p1SetColorCallback();
  p2setColorCallback();
  p1AttackDelayInput.parentElement.style.display = 'none';
  return { listenerManager, setOnSubmit };
};
