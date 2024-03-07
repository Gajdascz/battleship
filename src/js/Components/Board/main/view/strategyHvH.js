import { BaseBoardView } from './BoardView';
import { AlternatePlayerDialogView } from '../../../Dialogs/AlternatePlayersDialog/AlternatePlayerDialogView';
import { MOUSE_EVENTS } from '../../../../Utility/constants/dom/domEvents';
import { buildUIElement } from '../../../../Utility/uiBuilderUtils/uiBuilders';
import { COMMON_ELEMENTS } from '../../../../Utility/constants/dom/elements';
import { BASE_CLASSES } from '../../../../Utility/constants/dom/baseStyles';

export const StrategyHvH = (init, views, display, remove) => {
  const { mainGrid, trackingGrid, fleet } = views;
  const alternatePlayerDialog = AlternatePlayerDialogView();
  const endTurnButton = buildUIElement(COMMON_ELEMENTS.BUTTON, {
    text: 'End Turn',
    attributes: { class: `${BASE_CLASSES.BUTTON} end-turn-button`, disabled: '' }
  });

  let buttonManager = null;
  let opponentName = null;
  const strategy = {
    initialize: (opponentPlayerName, opponentFleet) => {
      const { mainGridButtonManager, setTrackingFleet } = init();
      opponentName = opponentPlayerName;
      setTrackingFleet(opponentFleet);
      buttonManager = mainGridButtonManager;
    },
    endTurn: () => {
      alternatePlayerDialog.display(opponentName);
      endTurnButton.disabled = true;
      remove();
    },
    placement: {
      startTurn: () => {
        trackingGrid.disable();
        trackingGrid.hide();
        buttonManager.addButton('submit-placements', mainGrid.getSubmitButton());
        buttonManager.addWrapper('rotate-ship');
        const updateRotateButton = ({ data }) => {
          const { id } = data;
          buttonManager.updateButton('rotate-ship', fleet.getRotateShipButton(id));
        };
        display();
        return updateRotateButton;
      },
      endTurn: () => {
        buttonManager.removeWrapper('submit-placements');
        buttonManager.removeWrapper('rotate-ship');
        strategy.endTurn();
      }
    },
    combat: {
      start: () => {},
      end: () => {}
    }
  };
  return strategy;
};

// const onEndTurn = () => {};

// const endTurnButtonController = {
//   listeners: [],
//   init: () => {
//     const wrapper = base.buttonsManager.getWrapper(`end-turn`);
//     wrapper.textContent = '';
//     wrapper.append(endTurnButton);
//     endTurnButton.addEventListener(MOUSE_EVENTS.CLICK, onEndTurn);
//   },
//   enable: () => {
//     endTurnButton.addEventListener(MOUSE_EVENTS.CLICK, onEndTurn);
//     endTurnButton.disabled = false;
//   },
//   disable: () => {
//     endTurnButton.removeEventListener(MOUSE_EVENTS.CLICK, onEndTurn);
//     endTurnButton.disabled = true;
//   },
//   addListener: (callback) => {
//     endTurnButtonController.listeners.push(callback);
//     endTurnButton.addEventListener(MOUSE_EVENTS.CLICK, callback);
//   },
//   removeListener: (callback) => {
//     const index = endTurnButtonController.listeners.findIndex((fn) => fn === callback);
//     endTurnButton.removeEventListener(MOUSE_EVENTS.CLICK, callback);
//     endTurnButtonController.listeners.splice(index, 1);
//   },
//   removeAllSetListeners: () => {
//     base.buttons.endTurn.listeners.forEach((callback) =>
//       endTurnButtonController.removeListener(callback)
//     );
//     endTurnButtonController.listeners = [];
//   },
//   remove: () => {
//     endTurnButton.removeEventListener(MOUSE_EVENTS.CLICK, onEndTurn);
//     endTurnButtonController.removeAllSetListeners();
//     endTurnButton.remove();
//   }
// };
// base.buttons.endTurn = {
//   init: () => endTurnButtonController.init(),
//   remove: () => endTurnButtonController.remove(),
//   enable: () => endTurnButtonController.enable(),
//   disable: () => endTurnButtonController.disable(),
//   addListener: (callback) => endTurnButtonController.addListener(callback),
//   removeListener: (callback) => endTurnButtonController.removeListener(callback),
//   removeAllSetListeners: () => endTurnButtonController.removeAllSetListeners()
// };
// base.setOpponentPlayerName = (name) => (opponentName = name);

// base.placement = {
//   initialize: () => {
//     base.trackingGrid.disable();
//     base.trackingGrid.hide();
//     base.buttons.submitPlacements.init();
//   },
//   onTurnStart: () => {
//     base.display();
//   },
//   end: () => {
//     base.displayAlternatePlayerDialog();
//     base.trackingGrid.show();
//     base.remove();
//   }
// };
