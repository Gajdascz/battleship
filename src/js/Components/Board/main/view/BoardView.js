import './board-style.css';
import {
  BOARD_CLASSES,
  buildBoardContainer,
  buildPlayerNameDisplay,
  buildButtonContainer,
  buildUtilityContainer,
  buildTrackingFleetContainer,
  ButtonContainerManager
} from './boardViewUtility';
import { BoardPlacementView } from './BoardPlacementView';
import { ListenerManager } from '../../../../Utility/uiBuilderUtils/ListenerManager';
import { MOUSE_EVENTS } from '../../../../Utility/constants/dom/domEvents';

export const BoardView = ({
  playerId,
  playerName,
  displayContainer = document.querySelector('body'),
  views
}) => {
  const { mainGrid, trackingGrid, fleet } = views;

  let mainGridButtonManager = null;
  let boardContainer = null;
  let trackingFleetContainer = null;

  const build = () => {
    if (boardContainer) remove();
    boardContainer = buildBoardContainer(playerId);
    const playerNameDisplay = buildPlayerNameDisplay(playerName);
    trackingFleetContainer = buildTrackingFleetContainer();
    const mainGridUtilityContainer = buildUtilityContainer(
      BOARD_CLASSES.MAIN_GRID_UTILITY_CONTAINER
    );
    const mainGridButtonContainer = buildButtonContainer(BOARD_CLASSES.MAIN_GRID_BUTTON_CONTAINER);
    const trackingGridUtilityContainer = buildUtilityContainer(
      BOARD_CLASSES.TRACKING_GRID_UTILITY_CONTAINER
    );
    boardContainer.append(playerNameDisplay);
    mainGrid.attachTo(boardContainer);
    trackingGrid.attachTo(boardContainer);
    mainGrid.attachWithinWrapper(mainGridUtilityContainer);
    fleet.attachMainFleetTo(mainGridUtilityContainer);
    mainGridUtilityContainer.append(mainGridButtonContainer);
    trackingGrid.attachWithinWrapper(trackingGridUtilityContainer);
    trackingGridUtilityContainer.append(trackingFleetContainer);
    mainGridButtonManager = ButtonContainerManager(mainGridButtonContainer);
  };

  const display = () => displayContainer.append(boardContainer);
  const remove = () => boardContainer.remove();

  build();

  const init = (opponentFleet, aiGrid = null) => {
    trackingFleetContainer.textContent = '';
    trackingFleetContainer.prepend(opponentFleet);
    if (aiGrid) trackingGrid.attachWithinWrapper(aiGrid);
  };
  const placementView = BoardPlacementView({
    buttonManager: mainGridButtonManager,
    fleet,
    mainGrid,
    trackingGrid,
    display,
    remove
  });

  const combatView = {
    endTurnBtn: null,
    setEndTurnButton: (btnElement) => {
      combatView.endTurnBtn = btnElement;
      mainGridButtonManager.addButton('endTurn', btnElement);
      combatView.endTurnBtn.addEventListener(MOUSE_EVENTS.CLICK, combatView.endTurn);
    },
    startTurn: () => display(),
    endTurn: () => remove(),
    reset: () => {
      if (combatView.endTurnBtn) {
        combatView.endTurnBtn = null;
        combatView.endTurnBtn.removeEventListener(MOUSE_EVENTS.CLICK, combatView.endTurn);
        mainGridButtonManager.removeWrapper('endTurn');
      }
      remove();
    }
  };

  return {
    display,
    remove,
    init,
    provideTrackingFleet: () => fleet.getTrackingFleet(),
    placementView,
    combatView,
    reset: () => build()
  };
};
