import { BaseBoardView } from './BaseBoardView';
import { AlternatePlayerDialogView } from '../../Dialogs/AlternatePlayersDialog/AlternatePlayerDialogView';
import { MOUSE_EVENTS } from '../../../Utility/constants/dom/domEvents';
import { buildUIElement } from '../../../Utility/uiBuilderUtils/uiBuilders';
import { COMMON_ELEMENTS } from '../../../Utility/constants/dom/elements';
export const HvHBoardView = ({
  scopedID,
  playerName,
  opponentPlayerName,
  mainGridView,
  trackingGridView,
  fleetView
}) => {
  let opponentName = opponentPlayerName;
  const base = BaseBoardView(scopedID, playerName, { mainGridView, trackingGridView, fleetView });
  const alternatePlayerDialog = AlternatePlayerDialogView();
  const endTurnButton = buildUIElement(COMMON_ELEMENTS.BUTTON, {
    text: 'End Turn',
    attributes: { class: 'end-turn-button' }
  });
  const onEndTurn = () => {
    alternatePlayerDialog.display(opponentPlayerName);
  };

  const endTurnButtonController = {
    init: () => {
      const wrapper = buttonsManager.getWrapper(`end-turn`);
      wrapper.textContent = '';
      wrapper.append(endTurnButton);
      endTurnButton.addEventListener(MOUSE_EVENTS.CLICK, onEndTurn);
    },
    enable: () => (endTurnButton.disabled = false),
    disable: () => (endTurnButton.disabled = true),
    remove: () => {
      endTurnButton.removeEventListener(MOUSE_EVENTS.CLICK, onEndTurn);
      endTurnButton.remove();
    }
  };
  base.buttons.endTurn = {
    init: () => endTurnButtonController.init(),
    remove: () => endTurnButtonController.remove(),
    enable: () => endTurnButtonController.enable(),
    disable: () => endTurnButtonController.disable()
  };
  base.setOpponentPlayerName = (name) => (opponentName = name);

  base.displayAlternatePlayerDialog = () => alternatePlayerDialog.display(opponentName);

  return base;
};
