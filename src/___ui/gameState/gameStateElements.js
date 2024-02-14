import { buildElementTree } from '../common/utility/elementObjBuilder';
import { divObj, paragraphObj, btnObj, spanObj } from '../common/utility/uiObjects';

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

const getSubmitShipsPlacementButton = () =>
  buildElementTree(
    btnObj('Submit Placements', { class: 'submit-ships-placement-button', disabled: 'true' })
  );

const getAlternatePlayerDialog = () => {
  const headerObj = paragraphObj('', { class: 'alternate-player-header' });
  const playerNameObj = spanObj('', { class: 'next-player-name' });
  headerObj.children = [playerNameObj];
  const proceedButton = btnObj('Proceed', { class: 'proceed-to-next-player-button' });
  const dialogElement = buildElementTree({
    type: 'dialog',
    attributes: { class: 'alternate-player-dialog' },
    children: [playerNameObj, proceedButton]
  });
  const playerName = dialogElement.querySelector('.next-player-name');
  dialogElement
    .querySelector('.proceed-to-next-player-button')
    .addEventListener('click', (e) => dialogElement.close());
  return {
    element: dialogElement,
    get playerName() {
      return playerName.textContent;
    },
    set playerName(name) {
      playerName.textContent = `${name}'s Turn`;
    },
    hideScreen: () => dialogElement.showModal()
  };
};

const getEndTurnButton = () =>
  buildElementTree(btnObj('End Turn', { class: 'end-turn-button hide', disabled: true }));

const trackingGridToAIDisplay = (trackingGrid, aiName) => {
  trackingGrid.classList.add('ai-display-tracking-grid');
  const header = trackingGrid.querySelector('.tracking-grid-header');
  const headerText = trackingGrid.querySelector('.tracking-grid-header > p');
  header.classList.add('ai-display-header');
  headerText.textContent = `${aiName}'s Attacks`;
  trackingGrid
    .querySelectorAll('button.grid-cell')
    .forEach((cell) => cell.setAttribute('disabled', true));
  return trackingGrid;
};

const shipRotationButton = () =>
  buildElementTree(btnObj('Rotate Ship', { class: 'rotate-ship-button' }));

export {
  getPlacementStateInstructions,
  getSubmitShipsPlacementButton,
  getAlternatePlayerDialog,
  getEndTurnButton,
  trackingGridToAIDisplay,
  shipRotationButton
};