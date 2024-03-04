import { COMMON_ELEMENTS } from '../../../../Utility/constants/dom/elements';
import { buildUIElement } from '../../../../Utility/uiBuilderUtils/uiBuilders';
import './board-style.css';

export const BoardView = ({ playerID, playerName, container = document.querySelector('body') }) => {
  let displayContainer = container;
  const BOARD_CONTAINER_CLASS = 'board';
  const BOARD_BUTTONS_CONTAINER_CLASS = 'board-buttons-container';
  const PLAYER_NAME_DISPLAY = 'player-name-display';
  const BOARD_BUTTON_WRAPPER_CLASS = `board-button-wrapper`;
  const BOARD_UTILITY_CONTAINER_CLASS = `board-utility-container`;

  const boardContainer = buildUIElement(COMMON_ELEMENTS.DIV, {
    attributes: { class: BOARD_CONTAINER_CLASS, id: `${playerID}-board` }
  });
  const playerNameDisplay = buildUIElement(COMMON_ELEMENTS.DIV, {
    text: playerName,
    attributes: { class: PLAYER_NAME_DISPLAY }
  });

  const buildButtonContainer = (classAttr = null) => {
    let finalClass = BOARD_BUTTONS_CONTAINER_CLASS;
    if (classAttr) finalClass = `${finalClass} ${classAttr}`;
    return buildUIElement(COMMON_ELEMENTS.DIV, {
      attributes: { class: finalClass }
    });
  };
  boardContainer.append(playerNameDisplay);

  const buildUtilityContainer = (classAttr) => {
    let finalClass = BOARD_UTILITY_CONTAINER_CLASS;
    if (classAttr) finalClass = `${finalClass} ${classAttr}`;
    return buildUIElement(COMMON_ELEMENTS.DIV, {
      attributes: { class: finalClass }
    });
  };

  const buildButtonWrapper = (id) =>
    buildUIElement(COMMON_ELEMENTS.DIV, {
      attributes: { class: `${id}-${BOARD_BUTTON_WRAPPER_CLASS}` }
    });

  const boardElements = new Map();

  const addToBoard = (id, element) => {
    boardContainer.append(element);
    boardElements.set(id, element);
  };

  const addUtilityContainerTo = (parentID, id, containerClass) => {
    const element = boardElements.get(parentID);
    if (!element) return;
    const utilityContainer = buildUtilityContainer(containerClass);
    element.append(utilityContainer);
    boardElements.set(id, utilityContainer);
  };
  const addButtonContainerTo = (parentID, id, containerClass) => {
    const element = boardElements.get(parentID);
    if (!element) return;
    const buttonContainer = buildButtonContainer(containerClass);
    element.append(buttonContainer);
    boardElements.set(id, {
      container: buttonContainer,
      manager: buildButtonContainerManager(buttonContainer)
    });
  };
  const addToBoardElement = (parentID, id, element) => {
    const boardElement = boardElements.get(parentID);
    if (!boardElement) return;
    boardElement.append(element);
    boardElements.set(id, element);
  };

  const buildButtonContainerManager = (container) => {
    const wrappers = {};
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
      if (wrappers[id]) wrappers[id].remove();
    };
    const removeWrapper = (id) => {
      const wrapper = wrappers.get(id);
      if (wrapper) {
        wrapper.textContent = '';
        wrappers.delete(id);
      }
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

  return {
    getButtonContainerManager: (containerID) => {
      const obj = boardElements.get(containerID);
      if (!obj) return;
      const { manager } = obj;
      return manager;
    },
    setContainer: (container) => {
      remove();
      displayContainer = container;
      display();
    },
    addToBoard,
    addToBoardElement,
    addUtilityContainerTo,
    addButtonContainerTo,
    display,
    remove
  };
};
// const rotateShipButtonController = {
//   update: (shipID) => {
//     const btn = fleetView.getRotateShipButton(shipID);
//     updateButton(`rotate-ship`, btn);
//   },
//   clearWrapper: () => (getWrapper(`rotate-ship`).textContent = '')
// };

// const submitPlacementsButtonController = {
//   init: () =>
//     updateButton(
//       `submit-placements`,
//       mainGridView.elements.getSubmitPlacementsButton()
//     )
// };

// const trackingGrid = {
//   setFleet: (opponentTrackingFleet) =>
//     gridUtilityContainers.tracking.append(opponentTrackingFleet),
//   hide: () => trackingGridView.hide(),
//   show: () => trackingGridView.show(),
//   enable: () => trackingGridView.enable(),
//   disable: () => trackingGridView.disable(),
//   attachToWrapper: (element) => trackingGridView.attachToWrapper(element)
// };
// mainGridView.attachTo(boardContainer);
// fleetView.attachMainFleetTo(gridUtilityContainers.main);
// mainGridView.attachToWrapper(gridUtilityContainers.main);
// trackingGridView.attachToWrapper(gridUtilityContainers.tracking);
// gridUtilityContainers.main.append(buttonsContainer);
