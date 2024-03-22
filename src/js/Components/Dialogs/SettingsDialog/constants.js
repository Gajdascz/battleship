import { INTERACTIVE_ELEMENTS } from '../../../Utility/constants/dom/elements';

export const GENERAL = {
  LABEL_ELEMENT: 'label',
  CLASSES: {
    HIDE: 'hide',
    HEADER_WRAPPER: 'settings-dialog-header-wrapper',

    DIALOG_TITLE: 'dialog-title',
    DIALOG: `settings-dialog dialog`
  },
  TEXTS: {
    DIALOG_TITLE: 'Settings'
  }
};
export const PLAYER_SETTINGS = {
  COMMON_CLASSES: {
    INFO_CONTAINER: 'player-information-container',
    INFO_INPUT_CONTAINER: 'player-information-input-container'
  },
  PLAYER_ONE: {
    ID: 'player-one',
    TYPE_DEFAULT: 'human',
    TITLE: 'Player One',
    TITLE_CLASS: 'player-one-settings-title'
  },
  PLAYER_TWO: {
    ID: 'player-two',
    TYPE_DEFAULT: 'ai',
    TITLE: 'Player Two',
    TITLE_CLASS: 'player-two-settings-title'
  }
};

export const INPUT_FIELDS = {
  TEXT_NAME: (player) => ({
    ELEMENT: INTERACTIVE_ELEMENTS.INPUT,
    CLASS: `${player}-name-text-input`,
    ATTRIBUTES: {
      TYPE: 'text',
      PLACEHOLDER: 'Username',
      ID: `${player}-name`
    }
  }),
  SELECT: {
    ELEMENT: INTERACTIVE_ELEMENTS.SELECT,
    OPTION_ELEMENT: INTERACTIVE_ELEMENTS.OPTION,
    INPUT_FIELD_CLASS: (id) => `${id}-select-input`
  },
  ATTACK_DELAY: {
    ELEMENT: INTERACTIVE_ELEMENTS.INPUT,
    ATTRIBUTES: {
      TYPE: 'number',
      MIN: 0,
      DEFAULT_VALUE: 250
    },
    CLASSES: {
      WRAPPER: 'attack-delay-input-wrapper',
      LABEL: 'attack-delay-label',
      ATTACK_DELAY_INPUT: 'attack-delay-input'
    },
    TEXTS: {
      ATTACK_DELAY: 'Attack Delay (ms)'
    }
  },
  DIMENSIONS: {
    ELEMENT: INTERACTIVE_ELEMENTS.INPUT,
    ATTRIBUTES: {
      TYPE: 'number',
      MAX: 26,
      MIN: 10,
      ROWS_ID: 'rows',
      COLS_ID: 'cols'
    },
    CLASSES: {
      COLS_INPUT: 'cols-input',
      ROWS_INPUT: 'rows-input',
      COLS_INPUT_WRAPPER: 'cols-input-wrapper',
      COLS_INPUT_LABEL: 'cols-input-label',
      ROWS_INPUT_WRAPPER: 'rows-input-wrapper',
      ROWS_INPUT_LABEL: 'rows-input-label'
    },
    TEXTS: {
      ROWS: 'Rows',
      COLS: 'Cols'
    }
  }
};

export const SELECTIONS = {
  DIFFICULTY: {
    ATTRIBUTES: {
      ID: (player) => `${player}-difficulty`
    },
    OPTIONS: [
      { id: 'easy', text: 'Easy', value: `${0}` },
      { id: 'medium', text: 'Medium', value: `${1}` },
      { id: 'hard', text: 'Hard', value: `${2}` }
    ]
  },
  PLAYER_TYPE: {
    TYPES: {
      HUMAN: 'human',
      COMPUTER: 'ai'
    },
    TEXTS: {
      HUMAN: 'Human',
      COMPUTER: 'Computer'
    },
    PLAYER_TYPE_CLASS: (player) => `${player}-type`
  },

  LETTER_AXIS: {
    CLASSES: {
      WRAPPER: 'letter-axis-input-wrapper',
      LABEL: 'letter-axis-input-label'
    },
    ATTRIBUTES: {
      ID: 'letter-axis'
    },
    TEXTS: {
      LABEL: 'Letter Axis',
      ROW: 'Row',
      COL: 'Column'
    },
    OPTIONS: [
      { id: 'row', text: 'Row', value: 'row' },
      { id: 'col', text: 'Column', value: 'col' }
    ]
  }
};

export const BOARD_SETTINGS = {
  CLASSES: {
    CONTAINER: 'board-settings-container',
    INPUTS_CONTAINER: 'board-settings-inputs-container',
    TITLE: 'board-settings-title'
  },
  TEXTS: {
    TITLE: 'Board'
  }
};

export const BUTTONS = {
  CONTAINER_CLASS: 'dialog-buttons-container',
  SUBMIT: {
    TEXT: 'Submit',
    CLASS: 'settings-submit-button',
    DISCLAIMER: {
      TEXT: '*Submitting will start a new game',
      CLASS: 'settings-submit-disclaimer hide'
    }
  },
  CANCEL: {
    TEXT: 'Cancel',
    CLASS: 'settings-cancel-button'
  },
  INSTRUCTIONS: {
    TEXT: 'Instructions',
    CLASS: 'settings-instructions-button'
  }
};
