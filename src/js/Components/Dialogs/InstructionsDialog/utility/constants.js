const INSTRUCTION_BUTTON_CLASS = (instruction) => `${instruction}-instruction-button`;

const INSTRUCTIONS_DIALOG = {
  CLASS: `instructions-dialog dialog`,
  HEADER: {
    TEXT: 'INSTRUCTIONS',
    CLASS: `dialog-title`,
    WRAPPER_CLASS: 'instructions-header-wrapper'
  },
  CLOSE_BUTTON: {
    TEXT: 'CLOSE',
    CLASS: `instructions-close-button`
  },
  CONTENT_CONTAINER_CLASS: 'instructions-content-container'
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
  SETTINGS: {
    TEXT: 'Settings',
    CLASS: INSTRUCTION_BUTTON_CLASS('settings')
  }
};

export { INSTRUCTIONS_DIALOG, INSTRUCTION_BUTTONS };
