export const combatInstructionsConfig = {
  instructionName: 'combatInstructions',
  instructionHeaderText: 'Combat Instructions',
  sections: [
    {
      sectionName: 'gridAndCells',
      markerType: 'bullet',
      sectionHeaderText: 'Grids and Cells',
      instructions: [
        "As you know from the placement stage, the Home Territory grid is where you place your ships. Your placed ships are displayed as gray cells containing the first letter of the placed ship's name.",
        'The Enemy Territory grid is where you send and track attacks.'
      ]
    },
    {
      sectionName: 'attacking',
      markerType: 'bullet',
      sectionHeaderText: 'Attacking',
      instructions: [
        'To send an attack on your turn, click on an unexplored cell in the "Enemy Territory" grid.',
        'A light gray cell indicates a missed attack and a red cell indicates a hit.'
      ]
    },
    {
      sectionName: 'turnRotation',
      markerType: 'bullet',
      sectionHeaderText: 'Turns',
      instructions: [
        "If you're playing vs the computer, then after you send an attack it will respond immediately and you can continue until the game ends.",
        'If you\'re playing vs another human, after you send an attack you will be unable to send another attack. Instead you can click the "End Turn" button which will hide the screen to allow the next player to continue.'
      ]
    },
    {
      sectionName: 'gameEnd',
      markerType: 'bullet',
      sectionHeaderText: 'Game Over',
      instructions: [
        "When all of a player's ships have been sunk, the game ends.",
        'The winner will be displayed and a new game can be started directly by pressing the "Restart Game" button. Or you can exit the dialog and adjust the settings to start a new game.'
      ]
    }
  ]
};
