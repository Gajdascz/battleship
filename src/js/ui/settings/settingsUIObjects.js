import { paragraphObj, divObj, btnObj } from '../common/uiObjects';

const textNameInputObj = (player, hide = false) => ({
  type: 'input',
  attributes: {
    type: 'text',
    id: `${player}-name`,
    class: `${player}-name-text-input ${hide ? 'hide' : ''}`,
    placeholder: 'Username'
  }
});

const optionObj = ({ value, text, isSelected = false } = {}) => ({
  type: 'option',
  text,
  attributes: { value, ...(isSelected && { selected: '' }) }
});

const selectInputObj = (id, name, options, hide = false) => ({
  type: 'select',
  attributes: {
    type: 'select',
    id,
    class: `${name}-select-input ${hide ? 'hide' : ''}`
  },
  children: options.map((option) => optionObj(option))
});

const playerTypeSelectInputObj = (player, selected) => {
  const children = [];
  children.push({ value: 'human', text: 'Human', isSelected: selected === 'human' });
  if (player === 'player-two')
    children.push({ value: 'ai', text: 'Computer', isSelected: selected === 'ai' });
  return selectInputObj(`${player}-type`, `${player}-type`, children);
};

const difficultySelectInputObj = (player, hide = false) =>
  selectInputObj(
    `${player}-difficulty`,
    `${player}-difficulty`,
    [
      { id: 'easy', text: 'Easy', value: 0 },
      { id: 'medium', text: 'Medium', value: 1 },
      { id: 'hard', text: 'Hard', value: 2 }
    ],
    hide
  );

const numberInputObj = (min, max, id, classAttr) => ({
  type: 'input',
  attributes: {
    type: 'number',
    id,
    class: classAttr,
    value: min,
    max,
    min
  }
});
const labelObj = (text, attributes) => ({
  type: 'label',
  text,
  attributes: {
    ...attributes
  }
});

const letterAxisSelectObj = () =>
  divObj({ class: 'letter-axis-input-wrapper' }, [
    selectInputObj('letter-axis', 'letter-axis', [
      { id: 'row', text: 'Row', value: 'row' },
      { id: 'col', text: 'Column', value: 'col' }
    ]),
    labelObj('Letter Axis', { for: 'letter-axis', class: 'letter-axis-input-label' })
  ]);
const boardSettingsInputs = () => {
  const max = 26;
  const min = 10;
  return divObj({ class: 'board-settings-inputs-container' }, [
    divObj({ class: 'rows-input-wrapper' }, [
      numberInputObj(min, max, 'rows', 'rows-input'),
      labelObj('Rows', { for: 'rows', class: 'rows-input-label' })
    ]),
    divObj({ class: 'cols-input-wrapper' }, [
      numberInputObj(min, max, 'cols', 'cols-input'),
      labelObj('Cols', { for: 'cols', class: 'cols-input-label' })
    ]),
    letterAxisSelectObj()
  ]);
};

const playerOneInfoInputObj = () =>
  divObj({ class: 'player-information-container' }, [
    paragraphObj('Player One', { class: 'player-one-settings-title' }),
    playerTypeSelectInputObj('player-one', 'human'),
    textNameInputObj('player-one')
  ]);

const playerTwoInfoInputObj = () =>
  divObj({ class: 'player-information-container' }, [
    paragraphObj('Player Two', { class: 'player-two-settings-title' }),
    playerTypeSelectInputObj('player-two', 'ai'),
    textNameInputObj('player-two', true),
    difficultySelectInputObj('player-two')
  ]);

const settingsTitleObj = () => paragraphObj('Settings', { class: 'settings-dialog-title' });

const playerInfoInputContainerObj = () =>
  divObj({ class: 'player-information-input-container' }, [
    playerOneInfoInputObj(),
    playerTwoInfoInputObj()
  ]);

const boardSettingsContainerObj = () =>
  divObj({ class: 'board-settings-container' }, [
    paragraphObj('Board', { class: 'board-settings-title' }),
    boardSettingsInputs()
  ]);

const settingsButtonsContainerObj = () => {
  const submitBtn = btnObj('Submit', { class: 'settings-submit-button' });
  const submitDisclaimer = paragraphObj('*Submitting will start a new game', {
    class: 'settings-submit-disclaimer hide'
  });
  const cancelBtn = btnObj('Cancel', { class: 'settings-cancel-button' });
  return divObj({ class: 'dialog-buttons-container' }, [submitBtn, submitDisclaimer, cancelBtn]);
};

export {
  playerInfoInputContainerObj,
  settingsTitleObj,
  boardSettingsContainerObj,
  settingsButtonsContainerObj
};
