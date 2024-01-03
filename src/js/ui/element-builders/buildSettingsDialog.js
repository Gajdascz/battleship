import { buildElementTree } from '../utility-ui/elementObjBuilder';

const getTextNameInputObj = (player, hide = false) => {
  return {
    type: 'input',
    attributes: {
      type: 'text',
      id: `${player}-name`,
      class: `${player}-name-text-input ${hide ? 'hide' : ''}`,
      placeholder: 'Username'
    }
  };
};

const getBtnObj = (btnTxt, attributes = {}) => {
  return {
    type: 'button',
    text: btnTxt,
    attributes
  };
};

const getDivObj = (attributes = {}, children) => {
  return {
    type: 'div',
    attributes,
    children
  };
};

const getParagraphObj = (text, attributes = {}) => {
  return {
    type: 'p',
    text,
    attributes
  };
};

const getOptionObj = ({ value, text, isSelected = false } = {}) => {
  return {
    type: 'option',
    text,
    attributes: { value, ...(isSelected && { selected: '' }) }
  };
};

const getSelectInputObj = (id, name, options, hide = false) => {
  return {
    type: 'select',
    attributes: {
      type: 'select',
      id,
      class: `${name}-select-input ${hide ? 'hide' : ''}`
    },
    children: options.map((option) => getOptionObj(option))
  };
};

const getPlayerSelectInputObj = (player, selected) => {
  return getSelectInputObj(`${player}-type`, `${player}-type`, [
    { value: 'human', text: 'Human', isSelected: selected === 'human' },
    { value: 'computer', text: 'Computer', isSelected: selected === 'computer' }
  ]);
};

const getDifficultySelectInputObj = (player, hide = false) => {
  return getSelectInputObj(
    `${player}-difficulty`,
    `${player}-difficulty`,
    [
      { id: 'easy', text: 'Easy', value: 0 },
      { id: 'medium', text: 'Medium', value: 1 },
      { id: 'hard', text: 'Hard', value: 2 }
    ],
    hide
  );
};

const getNumberInputObj = (min, max, id, classAttr) => {
  return {
    type: 'input',
    attributes: {
      type: 'number',
      id,
      class: classAttr,
      value: min,
      max,
      min
    }
  };
};
const getLabelObj = (text, attributes) => {
  return {
    type: 'label',
    text,
    attributes: {
      ...attributes
    }
  };
};
const getBoardSettingsInputs = () => {
  const max = 25;
  const min = 10;
  return getDivObj({ class: 'board-settings-inputs-container' }, [
    getDivObj({ class: 'rows-input-wrapper' }, [
      getNumberInputObj(min, max, 'rows', 'rows-input'),
      getLabelObj('Rows', { for: 'rows', class: 'rows-input-label' })
    ]),
    getDivObj({ class: 'cols-input-wrapper' }, [
      getNumberInputObj(min, max, 'cols', 'cols-input'),
      getLabelObj('Cols', { for: 'cols', class: 'cols-input-label' })
    ]),
    getLetterAxisSelectObj()
  ]);
};

const getLetterAxisSelectObj = () => {
  return getDivObj({ class: 'letter-axis-input-wrapper' }, [
    getSelectInputObj('letter-axis', 'letter-axis', [
      { id: 'row', text: 'Row', value: 'row' },
      { id: 'col', text: 'Column', value: 'col' }
    ]),
    getLabelObj('Letter Axis', { for: 'letter-axis', class: 'letter-axis-input-label' })
  ]);
};

const getButtonsContainerObj = () => {
  const submitBtn = getBtnObj('Submit', { class: 'settings-submit-button' });
  const submitDisclaimer = getParagraphObj('*Submitting will start a new game', {
    class: 'settings-submit-disclaimer hide'
  });
  const cancelBtn = getBtnObj('Cancel', { class: 'settings-cancel-button' });
  return getDivObj({ class: 'dialog-buttons-container' }, [submitBtn, submitDisclaimer, cancelBtn]);
};

export function buildSettingsDialog() {
  const settingsTitleObj = getParagraphObj('Settings', { class: 'settings-dialog-title' });
  const playerOneInfoInputObj = getDivObj({ class: 'player-information-container' }, [
    getParagraphObj('Player One', { class: 'player-one-settings-title' }),
    getPlayerSelectInputObj('player-one', 'human'),
    getTextNameInputObj('player-one'),
    getDifficultySelectInputObj('player-one', true)
  ]);
  const playerTwoInfoInputObj = getDivObj({ class: 'player-information-container' }, [
    getParagraphObj('Player Two', { class: 'player-two-settings-title' }),
    getPlayerSelectInputObj('player-two', 'computer'),
    getTextNameInputObj('player-two', true),
    getDifficultySelectInputObj('player-two')
  ]);
  const playerInfoInputContainer = getDivObj({ class: 'player-information-input-container' }, [
    playerOneInfoInputObj,
    playerTwoInfoInputObj
  ]);

  const boardSettingsObj = getDivObj({ class: 'board-settings-container' }, [
    getParagraphObj('Board', { class: 'board-settings-title' }),
    getBoardSettingsInputs()
  ]);

  const dialogElement = buildElementTree({
    type: 'dialog',
    attributes: { class: 'settings-dialog' },
    children: [settingsTitleObj, playerInfoInputContainer, boardSettingsObj, getButtonsContainerObj()]
  });
  const addPlayerTypeSelectListener = (players) => {
    players.forEach((player) => {
      dialogElement.querySelector(`select#${player}-type`).addEventListener('change', function (e) {
        if (this.value === 'human') {
          dialogElement.querySelector(`input#${player}-name`).classList.remove('hide');
          dialogElement.querySelector(`select#${player}-difficulty`).classList.add('hide');
        } else {
          dialogElement.querySelector(`input#${player}-name`).classList.add('hide');
          dialogElement.querySelector(`select#${player}-difficulty`).classList.remove('hide');
        }
      });
    });
  };
  const getPlayerInputInfo = (player) => {
    const playerType = dialogElement.querySelector(`select#${player}-type`).value;
    if (playerType === 'human') {
      return {
        type: playerType,
        name: dialogElement.querySelector('input#player-one-name').value
      };
    } else {
      return {
        type: playerType,
        difficulty: dialogElement.querySelector(`select#${player}-difficulty`).value
      };
    }
  };
  const getBoardSettingsInput = () => {
    return {
      rows: dialogElement.querySelector('input#rows').value,
      cols: dialogElement.querySelector('input#cols').value,
      letterAxis: dialogElement.querySelector('select#letter-axis').value
    };
  };
  const changeDifficultyListener = (players) => {
    players.forEach((player) => {
      const typeSelect = dialogElement.querySelector(`select#${player}-difficulty`);
      typeSelect.classList.add('easy');
      typeSelect.addEventListener('change', function (e) {
        if (this.value === '0') {
          this.classList.add('easy');
          this.classList.remove('medium');
          this.classList.remove('hard');
        } else if (this.value === '1') {
          this.classList.remove('easy');
          this.classList.add('medium');
          this.classList.remove('hard');
        } else {
          this.classList.remove('easy');
          this.classList.remove('medium');
          this.classList.add('hard');
        }
      });
    });
  };
  addPlayerTypeSelectListener(['player-one', 'player-two']);

  const cancelBtn = dialogElement.querySelector('.settings-cancel-button');
  cancelBtn.setAttribute('disabled', '');
  cancelBtn.classList.add('hide');
  changeDifficultyListener(['player-one', 'player-two']);
  dialogElement.querySelector('.settings-submit-button').addEventListener('click', function (e) {
    const event = new CustomEvent('settingsSubmit', {
      detail: {
        playerOneInformation: getPlayerInputInfo('player-one'),
        playerTwoInformation: getPlayerInputInfo('player-two'),
        boardOptions: getBoardSettingsInput()
      }
    });
    cancelBtn.removeAttribute('disabled');
    cancelBtn.classList.remove('hide');
    dialogElement.querySelector('.settings-submit-disclaimer').classList.remove('hide');
    document.dispatchEvent(event);
    dialogElement.close();
  });
  cancelBtn.addEventListener('click', function (e) {
    dialogElement.close();
  });
  return dialogElement;
}
