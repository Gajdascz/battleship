import { AlternatePlayerDialogView } from '../../../Dialogs/AlternatePlayersDialog/AlternatePlayerDialogView';
import { MOUSE_EVENTS } from '../../../../Utility/constants/dom/domEvents';
import { buildUIElement } from '../../../../Utility/uiBuilderUtils/uiBuilders';
import { COMMON_ELEMENTS } from '../../../../Utility/constants/dom/elements';
import { BASE_CLASSES } from '../../../../Utility/constants/dom/baseStyles';

export const HvHKit = (opponentPlayerName = null) => {
  let opponentName = opponentPlayerName;
  const alternatePlayerDialog = AlternatePlayerDialogView();
  const endTurnButton = buildUIElement(COMMON_ELEMENTS.BUTTON, {
    text: 'End Turn',
    attributes: { class: `${BASE_CLASSES.BUTTON} end-turn-button`, disabled: '' }
  });

  const endTurnButtonController = {
    listeners: [],
    id: 'end-turn',
    isEnabled: false,
    addListener: (callback) => {
      endTurnButtonController.listeners.push(callback);
      endTurnButton.addEventListener(MOUSE_EVENTS.CLICK, callback);
    },
    rmListener: (callback) => {
      const index = endTurnButtonController.listeners.findIndex((fn) => fn === callback);
      if (index === -1) return;
      endTurnButton.removeEventListener(MOUSE_EVENTS.CLICK, callback);
      endTurnButtonController.listeners.splice(index, 1);
    },
    enable: () => {
      if (endTurnButtonController.isEnabled) return;
      const listeners = endTurnButtonController.listeners;
      if (listeners.length > 0)
        listeners.forEach((listener) => endTurnButtonController.addListener(listener));
      endTurnButton.disabled = false;
      endTurnButtonController.isEnabled = true;
    },
    disable: () => {
      if (!endTurnButtonController.isEnabled) return;
      const listeners = endTurnButtonController.listeners;
      if (listeners.length > 0)
        listeners.forEach((listener) => endTurnButtonController.rmListener(listener));
      endTurnButton.disabled = true;
      endTurnButtonController.isEnabled = false;
    },
    clearListeners: () => {
      endTurnButtonController.disable();
      endTurnButtonController.listeners = [];
    },
    remove: () => {
      endTurnButtonController.clearListeners();
      endTurnButton.remove();
    }
  };
  base.buttons.endTurn = {
    init: () => endTurnButtonController.init(),
    remove: () => endTurnButtonController.remove(),
    enable: () => endTurnButtonController.enable(),
    disable: () => endTurnButtonController.disable(),
    addListener: (callback) => endTurnButtonController.addListener(callback),
    rmListener: (callback) => endTurnButtonController.rmListener(callback),
    clearListeners: () => endTurnButtonController.clearListeners()
  };
  base.setOpponentPlayerName = (name) => (opponentName = name);

  base.displayAlternatePlayerDialog = () => alternatePlayerDialog.display(opponentName);

  const placement = {
    initialize: (opponentName) => {
      alternatePlayerDialog.setPlayerName(opponentName);
      base.trackingGrid.disable();
      base.trackingGrid.hide();
      base.buttons.submitPlacements.init();
    },
    onTurnStart: () => {
      base.display();
    },
    onTurnEnd: () => {},
    end: () => {
      base.displayAlternatePlayerDialog();
      base.trackingGrid.show();
      base.remove();
    }
  };

  return base;
};
