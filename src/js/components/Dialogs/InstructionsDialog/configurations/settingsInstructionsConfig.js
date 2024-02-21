export const settingsInstructionsConfig = {
  instructionName: 'settingsInstructions',
  instructionHeaderText: 'Settings Instructions',
  sections: [
    {
      sectionName: 'playerSettings',
      markerType: 'bullet',
      sectionHeaderText: 'Player',
      instructions: [
        'Type: Currently, player one can only be human (no ai vs ai yet). But, player two can be either human or computer.',
        'Username: Human type players can enter their username. Those who do not enter a username will be labeled accordingly.',
        'Difficulty: Computer type players hav a difficulty option which dictates the level of intelligence and strategic capabilities. Easy -> Attacks randomly every turn with zero strategy. Medium -> Will follow up on hits until a ship is sunk. Hard -> Good luck.'
      ]
    },
    {
      sectionName: 'boardSettings',
      markerType: 'bullet',
      sectionHeaderText: 'Board',
      instructions: [
        'Rows and Cols: The number of rows and/or columns to make the grid (Minimum = 10, Maximum = 26).',
        'Letter Axis: The axis to use letter labels. Respectively, coordinates are displayed like so, Row -> "A5", Column -> "5A".'
      ]
    },
    {
      sectionName: 'buttons',
      markerType: 'bullet',
      sectionHeaderText: 'Buttons',
      instructions: [
        'Submit: Updates the game settings and starts a new  game.',
        'Instructions: Opens the these instructions.',
        'Cancel: Closes the dialog without making any changes.'
      ]
    }
  ]
};
