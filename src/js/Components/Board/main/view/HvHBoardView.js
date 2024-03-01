import { BaseBoardView } from './BaseBoardView';
import { AlternatePlayerDialogView } from '../../../Dialogs/AlternatePlayersDialog/AlternatePlayerDialogView';
import { MOUSE_EVENTS } from '../../../../Utility/constants/dom/domEvents';
import { buildUIElement } from '../../../../Utility/uiBuilderUtils/uiBuilders';
import { COMMON_ELEMENTS } from '../../../../Utility/constants/dom/elements';
import { BASE_CLASSES } from '../../../../Utility/constants/dom/baseStyles';

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
    attributes: { class: `${BASE_CLASSES.BUTTON} end-turn-button`, disabled: '' }
  });

  const onEndTurn = () => {
    alternatePlayerDialog.display(opponentName);
    endTurnButton.disabled = true;
    base.remove();
  };

  const endTurnButtonController = {
    init: () => {
      const wrapper = base.buttonsManager.getWrapper(`end-turn`);
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

  base.placement = {
    initialize: () => {
      base.trackingGrid.disable();
      base.trackingGrid.hide();
      base.buttons.submitPlacements.init();
    },
    onTurnStart: () => {
      base.display();
    },
    end: () => {
      base.displayAlternatePlayerDialog();
      base.trackingGrid.show();
      base.remove();
    }
  };

  return base;
};
