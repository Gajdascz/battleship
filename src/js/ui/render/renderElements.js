import { buildElementTree } from '../utility-ui/elementObjBuilder';

const getPlacementStateInstructions = () => {
  return buildElementTree({
    type: 'div',
    attributes: { class: 'placement-state-instructions-container' },
    children: [
      {
        type: 'p',
        text: 'Placement Instructions',
        attributes: { class: 'placement-instructions-header' }
      },
      {
        type: 'div',
        attributes: { class: 'selecting-and-placing-ships-instruction-container' },
        children: [
          {
            type: 'p',
            text: 'Selecting and Placing Ships',
            attributes: { class: 'placement-controls-header' }
          },
          {
            type: 'p',
            text: `1. `,
            attributes: { class: 'placement-controls-list-item' },
            children: [
              {
                type: 'span',
                text: 'To select a ship, click on it in the "Your Fleet" list using the Left-Mouse Button.',
                attributes: { class: 'placement-controls-instruction' }
              }
            ]
          },
          {
            type: 'p',
            text: `2. `,
            attributes: { class: 'placement-controls-list-item' },
            children: [
              {
                type: 'span',
                text: 'Place the selected ship on your "Home Territory" grid by clicking wth the Left-Mouse Button at the desired grid location.',
                attributes: { class: 'placement-controls-instruction' }
              }
            ]
          }
        ]
      },
      {
        type: 'div',
        attributes: { class: 'rotating-ships-instructions-container' },
        children: [
          {
            type: 'p',
            text: 'Rotating Ships',
            attributes: { class: 'placement-controls-header' }
          },
          {
            type: 'p',
            text: `• `,
            attributes: { class: 'placement-controls-list-item' },
            children: [
              {
                type: 'span',
                text: `To rotate a ship before placing it, use the `,
                attributes: { class: 'placement-controls-instruction' }
              },
              {
                type: 'span',
                text: 'Middle-Mouse Button, Space-Bar, or the R Key.',
                attributes: { class: 'placement-controls-button' }
              }
            ]
          }
        ]
      },
      {
        type: 'div',
        attributes: { class: 'repositioning-ships-instructions-container' },
        children: [
          {
            type: 'p',
            text: 'Repositioning Ships',
            attributes: { class: 'placement-controls-header' }
          },
          {
            type: 'p',
            text: `• `,
            attributes: { class: 'placement-controls-list-item' },
            children: [
              {
                type: 'span',
                text: 'To reposition a ship that\'s already placed, click on it again in the "Your Fleet" list using the Left-Mouse Button and then place it in a new location on the grid.',
                attributes: { class: 'placement-controls-instruction' }
              }
            ]
          }
        ]
      },
      {
        type: 'div',
        attributes: { class: 'finalizing-placements-instructions-container' },
        children: [
          {
            type: 'p',
            text: 'Finalizing Placement',
            attributes: { class: 'placement-controls-header' }
          },
          {
            type: 'p',
            text: `• `,
            attributes: { class: 'placement-controls-list-item' },
            children: [
              {
                type: 'span',
                text: 'Once you have positioned all your ships, the "Submit Placements" button directly below the "Your Fleet" list will become active.',
                attributes: { class: 'placement-controls-instruction' }
              }
            ]
          },
          {
            type: 'p',
            text: `• `,
            attributes: { class: 'placement-controls-list-item' },
            children: [
              {
                type: 'span',
                text: 'Click the "Submit Placements" button to confirm your ship placements and proceed.',
                attributes: { class: 'placement-controls-instruction' }
              }
            ]
          }
        ]
      }
    ]
  });
};

const getSubmitShipsPlacementButton = () => {
  return buildElementTree({
    type: 'button',
    text: 'Submit Placements',
    attributes: { class: 'submit-ships-placement-button', disabled: 'true' }
  });
};

export { getPlacementStateInstructions, getSubmitShipsPlacementButton };
