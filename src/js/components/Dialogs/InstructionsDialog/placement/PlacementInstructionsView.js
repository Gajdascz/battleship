import {
  buildUIObj,
  buildElementFromUIObj,
  buildUIElement
} from '../../../utility/uiBuilderUtils/uiBuilders';

const placementControlsHeader = (text) =>
  paragraphObj(text, { class: 'placement-controls-header' });

const placementControlsListItem = (marker, text) => {
  const listItem = paragraphObj(marker, { class: 'placement-controls-list-item' });
  listItem.children = [spanObj(text, { class: 'placement-controls-instruction' })];
  return listItem;
};

const getPlacementStateInstructions = () => {
  const selectingAndPlacingShips = divObj(
    { class: 'selecting-and-placing-ships-instructions-container' },
    [
      placementControlsHeader('Selecting and Placing Ships'),
      placementControlsListItem(
        `1. `,
        'To select a ship, click on it in the "Your Fleet" list using the Left-Mouse Button.'
      ),
      placementControlsListItem(
        `2. `,
        'Place the selected ship on your "Home Territory" grid by clicking wth the Left-Mouse Button at the desired grid location.'
      )
    ]
  );
  const rotatingShips = divObj({ class: 'rotating-ships-instructions-container' }, [
    placementControlsHeader('Rotating Ships'),
    placementControlsListItem(
      `• `,
      `To rotate a ship before placing it, click the "Rotate Ship" Button, or press the Middle-Mouse Button, Space-Bar, or the R Key`
    )
  ]);

  const repositioningShips = divObj({ class: 'repositioning-ships-instructions-container' }, [
    placementControlsHeader('Repositioning Ships'),
    placementControlsListItem(
      `• `,
      `To reposition a ship that's already placed, click on it again in the "Your Fleet" list using the Left-Mouse Button and then place it in a new location on the grid.`
    )
  ]);

  const finalizingPlacements = divObj({ class: 'finalizing-placements-instructions-container' }, [
    placementControlsHeader('Finalizing Placement'),
    placementControlsListItem(
      `• `,
      'Once you have positioned all your ships, the "Submit Placements" button directly below the "Your Fleet" list will become active.'
    ),
    placementControlsListItem(
      `• `,
      'Click the "Submit Placements" button to confirm your ship placements and proceed.'
    )
  ]);

  return buildElementTree(
    divObj({ class: 'placement-state-instructions-container' }, [
      paragraphObj('Placement Instructions', { class: 'placement-instructions-header' }),
      selectingAndPlacingShips,
      rotatingShips,
      repositioningShips,
      finalizingPlacements
    ])
  );
};
