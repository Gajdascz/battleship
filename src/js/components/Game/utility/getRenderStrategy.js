import { AlternatePlayerDialogView } from '../../Dialogs/AlternatePlayersDialog/AlternatePlayerDialogView';
import { buildUIElement } from '../../../utility/uiBuilderUtils/uiBuilders';
import { COMMON_ELEMENTS } from '../../../utility/constants/dom/elements';

const GAME_MODES = {
  HVH: 'HvH',
  HvA: 'HvA'
};

const strategyHvH = (model, view) => {
  let isFirstCall = true;
  const alternatePlayerDialog = AlternatePlayerDialogView();
  const endTurnButton = buildUIElement(COMMON_ELEMENTS.BUTTON, {
    text: 'End Turn',
    attributes: { class: 'end-turn-button' }
  });

  const onAttackProcessed = () => {
    // Disable tracking grid buttons (stop attacks)
    // Enable End Turn Button
  };
  const onTurnEnded = () => {
    // Display alternate player dialog
    // Switch Current players
    // Switch player boards in display
    // Enable player's tracking grid buttons (allow attacks)
  };
  const switchPlayers = () => {
    alternatePlayerDialog.display(model.getWaitingPlayerName());
    model.switchCurrentPlayer();
    renderCurrent();
  };
  const renderCurrent = () => {
    view.updateDisplay(model.getCurrentPlayerID(), model.getCurrentPlayerName());
  };
  const placementState = () => {
    if (!isFirstCall) switchPlayers();
    renderCurrent();
    isFirstCall = false;
  };
  return { placementState };
};

const strategyHvA = (model, view) => {
  const switchPlayers = () => {};
  const renderCurrent = () => {
    view.updateDisplay(model.getCurrentPlayerID(), model.getCurrentPlayerName());
  };
  const placementState = () => renderCurrent();

  const progressState = () => {};
  return { placementState };
};

export const getRenderStrategy = (gameModel, gameView) => {
  if (gameModel.getGameMode() === GAME_MODES.HVH) return strategyHvH(gameModel, gameView);
  else return strategyHvA(gameModel, gameView);
};
