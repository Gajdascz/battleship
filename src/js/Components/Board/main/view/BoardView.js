import { GAME_MODES } from '../../../../Utility/constants/common';
import { COMMON_ELEMENTS } from '../../../../Utility/constants/dom/elements';
import { buildUIElement } from '../../../../Utility/uiBuilderUtils/uiBuilders';
import './board-style.css';
import { StrategyHvA } from './strategyHvA';
import { StrategyHvH } from './strategyHvH';

export const BoardView = ({
  playerId,
  playerName,
  container = document.querySelector('body'),
  views,
  gameMode
}) => {
  const { mainGrid, trackingGrid, fleet } = views;

  let displayContainer = container;

  const BOARD_CONTAINER_CLASS = 'board';
  const BOARD_BUTTONS_CONTAINER_CLASS = 'board-buttons-container';
  const PLAYER_NAME_DISPLAY = 'player-name-display';
  const BOARD_BUTTON_WRAPPER_CLASS = `board-button-wrapper`;
  const BOARD_UTILITY_CONTAINER_CLASS = `board-utility-container`;

  const boardContainer = buildUIElement(COMMON_ELEMENTS.DIV, {
    attributes: { class: BOARD_CONTAINER_CLASS, id: `${playerId}-board` }
  });
  const playerNameDisplay = buildUIElement(COMMON_ELEMENTS.DIV, {
    text: playerName,
    attributes: { class: PLAYER_NAME_DISPLAY }
  });
  boardContainer.append(playerNameDisplay);

  const buildButtonContainer = (classAttr = null) => {
    let finalClass = BOARD_BUTTONS_CONTAINER_CLASS;
    if (classAttr) finalClass = `${finalClass} ${classAttr}`;
    return buildUIElement(COMMON_ELEMENTS.DIV, {
      attributes: { class: finalClass }
    });
  };

  const buildUtilityContainer = (classAttr) => {
    let finalClass = BOARD_UTILITY_CONTAINER_CLASS;
    if (classAttr) finalClass = `${finalClass} ${classAttr}`;
    return buildUIElement(COMMON_ELEMENTS.DIV, {
      attributes: { class: finalClass }
    });
  };

  const buildButtonContainerManager = (container) => {
    const wrappers = {};
    const buildButtonWrapper = (id) =>
      buildUIElement(COMMON_ELEMENTS.DIV, {
        attributes: { class: `${id}-${BOARD_BUTTON_WRAPPER_CLASS}` }
      });
    const addWrapper = (id) => {
      const wrapper = buildButtonWrapper(id);
      container.append(wrapper);
      wrappers[id] = wrapper;
    };
    const getWrapper = (id) => {
      if (!wrappers[id]) addWrapper(id);
      return wrappers[id];
    };
    const updateButton = (id, newButton) => {
      const wrapper = getWrapper(id);
      wrapper.textContent = '';
      wrapper.append(newButton);
    };
    const addButton = (id, button) => {
      let wrapper = getWrapper(id);
      if (!wrapper) buildButtonWrapper(id);
      wrapper = getWrapper(id);
      wrapper.append(button);
    };
    const removeButton = (id) => {
      if (wrappers[id]) wrappers[id].textContent = '';
    };
    const removeWrapper = (id) => {
      if (!wrappers[id]) return;
      removeButton(id);
      delete wrappers[id];
    };
    return {
      addWrapper,
      getWrapper,
      updateButton,
      addButton,
      removeButton,
      removeWrapper
    };
  };

  const display = () => displayContainer.append(boardContainer);
  const remove = () => boardContainer.remove();

  let trackingFleetContainer = null;
  const initialize = () => {
    const CLASSES = {
      MAIN_GRID_UTILITY_CONTAINER: 'main-grid-utility-container',
      TRACKING_GRID_UTILITY_CONTAINER: 'tracking-grid-utility-container',
      MAIN_GRID_BUTTON_CONTAINER: 'main-grid-button-container',
      TRACKING_FLEET_CONTAINER: 'tracking-fleet-container'
    };
    trackingFleetContainer = buildUIElement(COMMON_ELEMENTS.DIV, {
      attributes: { class: CLASSES.TRACKING_FLEET_CONTAINER }
    });
    mainGrid.attachTo(boardContainer);
    trackingGrid.attachTo(boardContainer);
    const mainGridUtilityContainer = buildUtilityContainer(CLASSES.MAIN_GRID_UTILITY_CONTAINER);
    mainGrid.attachWithinWrapper(mainGridUtilityContainer);
    fleet.attachMainFleetTo(mainGridUtilityContainer);
    const mainGridButtonContainer = buildButtonContainer(CLASSES.MAIN_GRID_BUTTON_CONTAINER);
    mainGridUtilityContainer.append(mainGridButtonContainer);
    const mainGridButtonManager = buildButtonContainerManager(mainGridButtonContainer);
    const trackingGridUtilityContainer = buildUtilityContainer(
      CLASSES.TRACKING_GRID_UTILITY_CONTAINER
    );
    trackingGrid.attachWithinWrapper(trackingGridUtilityContainer);
    trackingGridUtilityContainer.append(trackingFleetContainer);
    return { mainGridButtonManager };
  };
  const acceptTrackingFleet = (trackingFleet) => {
    if (!trackingFleetContainer) {
      throw new Error('Board must be initialized before accepting tracking fleet.');
    }
    trackingFleetContainer.textContent = '';
    trackingFleetContainer.append(trackingFleet);
  };

  let strategy;
  if (gameMode === GAME_MODES.HvA)
    strategy = StrategyHvA({ initialize, views, display, acceptTrackingFleet });
  else strategy = StrategyHvH(initialize, views, display, remove);
  return {
    display,
    remove,
    acceptTrackingFleet,
    provideTrackingFleet: () => fleet.elements.getTrackingFleet(),
    ...strategy
  };
};
