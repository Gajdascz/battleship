const addPlayersTypeSelectListeners = (element, player) => {
  element.querySelector(`select#${player}-type`).addEventListener('change', function (e) {
    if (this.value === 'human') {
      element.querySelector(`input#${player}-name`).classList.remove('hide');
      element.querySelector(`select#${player}-difficulty`).classList.add('hide');
    } else {
      element.querySelector(`input#${player}-name`).classList.add('hide');
      element.querySelector(`select#${player}-difficulty`).classList.remove('hide');
    }
  });
};
const addChangeDifficultySelectListeners = (element, players) => {
  players.forEach((player) => {
    const typeSelect = element.querySelector(`select#${player}-difficulty`);
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

const addButtonListeners = (element, submitSelector, cancelSelector, submitDiscSelector, playersArr) => {
  const submitBtn = element.querySelector(submitSelector);
  const cancelBtn = element.querySelector(cancelSelector);
  const submitDisclaimer = element.querySelector(submitDiscSelector);

  cancelBtn.setAttribute('disabled', '');
  cancelBtn.classList.add('hide');

  const getPlayerInputInfo = (player) => {
    const playerType = element.querySelector(`select#${player}-type`).value;
    if (playerType === 'human') {
      return {
        type: playerType,
        name: element.querySelector(`input#${player}-name`).value
      };
    } else {
      return {
        type: playerType,
        difficulty: element.querySelector(`select#${player}-difficulty`).value
      };
    }
  };
  const getBoardSettingsInput = () => {
    return {
      rows: element.querySelector('input#rows').value,
      cols: element.querySelector('input#cols').value,
      letterAxis: element.querySelector('select#letter-axis').value
    };
  };
  submitBtn.addEventListener('click', function (e) {
    const event = new CustomEvent('settingsSubmit', {
      detail: {
        playerOneInformation: getPlayerInputInfo(playersArr[0]),
        playerTwoInformation: getPlayerInputInfo(playersArr[1]),
        boardOptions: getBoardSettingsInput()
      }
    });
    cancelBtn.removeAttribute('disabled');
    cancelBtn.classList.remove('hide');
    submitDisclaimer.classList.remove('hide');
    document.dispatchEvent(event);
    element.close();
  });
  cancelBtn.addEventListener('click', function (e) {
    element.close();
  });
};

const addRestrictNumberInputsListener = (numberInputs) => {
  numberInputs.forEach((input) =>
    input.addEventListener('change', (e) => {
      if (input.value > 26) input.value = 26;
    })
  );
};

export {
  addPlayersTypeSelectListeners,
  addChangeDifficultySelectListeners,
  addButtonListeners,
  addRestrictNumberInputsListener
};
