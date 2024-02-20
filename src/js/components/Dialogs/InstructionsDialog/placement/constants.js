const GENERAL_PLACEMENT = {
  CLASSES: {
    HEADER: 'placement-controls-header',
    LIST_ITEM: 'placement-controls-list-item',
    INSTRUCTION: 'placement-controls-instruction',
    MAIN_CONTAINER: 'placement-state-instructions-container',
    DIALOG_HEADER: 'placement-instructions-header'
  },
  DIALOG_HEADER_TEXT: 'Placement Instructions'
};

const SELECTING_AND_PLACING = {
  CONTAINER_CLASS: 'selecting-and-placing-ships-instructions-container',
  HEADER_TEXT: 'Selecting and Placing Ships',
  INSTRUCTIONS: {
    ONE: 'To select a ship, click on it in the "Your Fleet" list using the Left-Mouse Button.',
    TWO: 'Place the selected ship on your "Home Territory" grid by clicking wth the Left-Mouse Button at the desired grid location.'
  }
};

const ROTATING = {
  CONTAINER_CLASS: 'rotating-ships-instructions-container',
  HEADER_TEXT: 'Rotating Ships',
  INSTRUCTIONS: {
    ONE: 'To rotate a ship before placing it, click the "Rotate Ship" Button, or press the Middle-Mouse Button, Space-Bar, or the R Key'
  }
};

const REPOSITIONING = {
  CONTAINER_CLASS: 'repositioning-ships-instructions-container',
  HEADER_TEXT: 'Repositioning Ships',
  INSTRUCTIONS: {
    ONE: `To reposition a ship that's already placed, click on it again in the "Your Fleet" list using the Left-Mouse Button and then place it in a new location on the grid.`
  }
};

const FINALIZING = {
  CONTAINER_CLASS: 'finalizing-placements-instructions-container',
  HEADER_TEXT: 'Finalizing Placement',
  INSTRUCTIONS: {
    ONE: 'Once you have positioned all your ships, the "Submit Placements" button directly below the "Your Fleet" list will become active.',
    TWO: 'Click the "Submit Placements" button to confirm your ship placements and proceed.'
  }
};

export { GENERAL_PLACEMENT, SELECTING_AND_PLACING, ROTATING, REPOSITIONING, FINALIZING };
