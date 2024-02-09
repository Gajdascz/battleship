import './styles/normalize.css';
import './styles/style.css';

import buildSettingsDialog from './js/ui/components/SettingsDialog/buildSettingsDialog';
import RenderController from './js/ui/render/RenderController';

import SessionStorage from './js/utility/SessionStorage';

import initiateGameController from './js/logic/game/initialization/initiateGameController';

const settingsDialog = buildSettingsDialog();
document.querySelector('body').append(settingsDialog);
settingsDialog.showModal();
document
  .querySelector('.settings-button')
  .addEventListener('click', (e) => settingsDialog.showModal());

const storage = SessionStorage();

const renderController = { current: RenderController() };
const resetRender = () => {
  if (renderController.current) {
    renderController.current.reset();
    renderController.current = null;
  }
  renderController.current = RenderController();
};

const getGameInfoObj = (e) => {
  if (!e.detail) {
    return {
      playerOneInformation: storage.getPlayerOneDataObj(),
      playerTwoInformation: storage.getPlayerTwoDataObj(),
      boardOptions: storage.getBoardOptionsObj()
    };
  } else {
    const { playerOneInformation, playerTwoInformation, boardOptions } = e.detail;
    storage.clear();
    storage.storePlayerOne(playerOneInformation);
    storage.storePlayerTwo(playerTwoInformation);
    storage.storeBoardOptions(boardOptions);
    return e.detail;
  }
};

const startGame = (e) => {
  const gameInfo = getGameInfoObj(e);
  resetRender();
  initiateGameController(gameInfo);
};

document.addEventListener('settingsSubmit', startGame);
document.addEventListener('gameRestarted', startGame);
