import { COMMON_ELEMENTS } from '../../../../Utility/constants/dom/elements';
import { buildUIElement } from '../../../../Utility/uiBuilderUtils/uiBuilders';

const BOARD_CLASSES = {
  CONTAINER: 'board',
  BUTTONS_CONTAINER: 'board-buttons-container',
  PLAYER_NAME_DISPLAY: 'player-name-display',
  BUTTON_WRAPPER: `board-button-wrapper`,
  UTILITY_CONTAINER: `board-utility-container`,
  MAIN_GRID_UTILITY_CONTAINER: 'main-grid-utility-container',
  TRACKING_GRID_UTILITY_CONTAINER: 'tracking-grid-utility-container',
  MAIN_GRID_BUTTON_CONTAINER: 'main-grid-button-container',
  TRACKING_FLEET_CONTAINER: 'tracking-fleet-container'
};

const buildBoardContainer = (playerId) =>
  buildUIElement(COMMON_ELEMENTS.DIV, {
    attributes: { class: BOARD_CLASSES.CONTAINER, id: `${playerId}-board` }
  });

const buildPlayerNameDisplay = (playerName) =>
  buildUIElement(COMMON_ELEMENTS.DIV, {
    text: playerName,
    attributes: { class: BOARD_CLASSES.PLAYER_NAME_DISPLAY }
  });

const buildButtonContainer = (classAttr = null) => {
  let finalClass = BOARD_CLASSES.BUTTONS_CONTAINER;
  if (classAttr) finalClass = `${finalClass} ${classAttr}`;
  return buildUIElement(COMMON_ELEMENTS.DIV, {
    attributes: { class: finalClass }
  });
};

const buildUtilityContainer = (classAttr) => {
  let finalClass = BOARD_CLASSES.UTILITY_CONTAINER;
  if (classAttr) finalClass = `${finalClass} ${classAttr}`;
  return buildUIElement(COMMON_ELEMENTS.DIV, {
    attributes: { class: finalClass }
  });
};
const buildTrackingFleetContainer = () =>
  buildUIElement(COMMON_ELEMENTS.DIV, {
    attributes: { class: BOARD_CLASSES.TRACKING_FLEET_CONTAINER }
  });

const ButtonContainerManager = (container) => {
  const wrappers = {};
  const buildButtonWrapper = (id) =>
    buildUIElement(COMMON_ELEMENTS.DIV, {
      attributes: { class: `${id}-${BOARD_CLASSES.BUTTON_WRAPPER}` }
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

export {
  BOARD_CLASSES,
  buildBoardContainer,
  buildPlayerNameDisplay,
  buildButtonContainer,
  buildUtilityContainer,
  buildTrackingFleetContainer,
  ButtonContainerManager
};
