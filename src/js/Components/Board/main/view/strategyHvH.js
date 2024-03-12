import { BaseBoardView } from './BoardView';
import { AlternatePlayerDialogView } from '../../../Dialogs/AlternatePlayersDialog/AlternatePlayerDialogView';
import { MOUSE_EVENTS } from '../../../../Utility/constants/dom/domEvents';
import { buildUIElement } from '../../../../Utility/uiBuilderUtils/uiBuilders';
import { COMMON_ELEMENTS } from '../../../../Utility/constants/dom/elements';
import { BASE_CLASSES } from '../../../../Utility/constants/dom/baseStyles';
import { ListenerManager } from '../../../../Utility/uiBuilderUtils/ListenerManager';

export const StrategyHvH = (init, views, display, remove) => {
  const { mainGrid, trackingGrid, fleet } = views;
  const alternatePlayerDialog = AlternatePlayerDialogView();
  const endTurnButton = buildUIElement(COMMON_ELEMENTS.BUTTON, {
    text: 'End Turn',
    attributes: { class: `${BASE_CLASSES.BUTTON} end-turn-button`, disabled: '' }
  });

  const listenerManager = ListenerManager();

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
      initialize: () => {
        const updateRotateButton = ({ data }) => {
          const { id } = data;
          buttonManager.updateButton('rotate-ship', fleet.getRotateShipButton(id));
        };
        return updateRotateButton;
      },
      startTurn: () => {
        trackingGrid.disable();
        trackingGrid.hide();
        buttonManager.addButton('submit-placements', mainGrid.getSubmitButton());
        buttonManager.addWrapper('rotate-ship');
        display();
      },
      endTurn: () => {
        buttonManager.removeWrapper('submit-placements');
        buttonManager.removeWrapper('rotate-ship');
        trackingGrid.show();
      }
    },
    combat: {
      initialize: () => {
        // listenerManager.addController({element: endTurnButton, event: MOUSE_EVENTS.CLICK, callback:})
      },
      start: () => {},
      end: () => {}
    }
  };
  return strategy;
};
