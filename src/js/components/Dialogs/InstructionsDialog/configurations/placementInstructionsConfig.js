export const placementInstructionsConfig = {
  instructionName: 'placementInstructions',
  instructionHeaderText: 'Placement Instructions',
  sections: [
    {
      sectionName: 'selectAndPlace',
      markerType: 'numeric',
      sectionHeaderText: 'Selecting and Placing Ships',
      instructions: [
        'To select a ship, click on it in the "Your Fleet" list using the Left-Mouse Button.',
        'Place the selected ship on your "Home Territory" grid by clicking the Left-Mouse Button at the desired grid location.'
      ]
    },
    {
      sectionName: 'rotate',
      markerType: 'bullet',
      sectionHeaderText: 'Rotating Ships',
      instructions: [
        'To rotate a ship before placing it you can: click the "Rotate Ship" Button, press the Middle-Mouse Button, Space-Bar, or the R Key'
      ]
    },
    {
      sectionName: 'reposition',
      markerType: 'bullet',
      sectionHeaderText: 'Repositioning Ships',
      instructions: [
        `To reposition a ship that's already placed, click on it again in the "Your Fleet" list using the Left-Mouse Button and then place it in a new location on the grid.`
      ]
    },
    {
      sectionName: 'finalize',
      markerType: 'numeric',
      sectionHeaderText: 'Finalizing Placement',
      instructions: [
        'Once you have positioned all your ships, the "Submit Placements" button directly below the "Your Fleet" list will become active.',
        'Click the "Submit Placements" button to confirm your ship placements and proceed.'
      ]
    }
  ]
};
