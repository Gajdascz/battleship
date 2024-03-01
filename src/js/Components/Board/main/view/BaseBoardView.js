import { COMMON_ELEMENTS } from '../../../../Utility/constants/dom/elements';
import { buildUIElement } from '../../../../Utility/uiBuilderUtils/uiBuilders';
import './board-style.css';

export const BaseBoardView = (
  scopedID,
  playerName,
  { mainGridView, trackingGridView, fleetView },
  container = document.querySelector('body')
) => {
  let displayContainer = container;
  const BOARD_CONTAINER_CLASS = 'board';
  const BOARD_BUTTONS_CONTAINER_CLASS = 'board-buttons-container';
  const PLAYER_NAME_DISPLAY = 'player-name-display';
  const boardContainer = buildUIElement(COMMON_ELEMENTS.DIV, {
    attributes: { class: BOARD_CONTAINER_CLASS, id: scopedID }
  });
  const playerNameDisplay = buildUIElement(COMMON_ELEMENTS.DIV, {
    text: playerName,
    attributes: { class: PLAYER_NAME_DISPLAY }
  });
  const buttonsContainer = buildUIElement(COMMON_ELEMENTS.DIV, {
    attributes: { class: BOARD_BUTTONS_CONTAINER_CLASS }
  });
  boardContainer.append(playerNameDisplay);

  const buildGridUtilityContainer = (className) =>
    buildUIElement(COMMON_ELEMENTS.DIV, { attributes: { class: className } });

  const buildButtonWrapper = (id) =>
    buildUIElement(COMMON_ELEMENTS.DIV, { attributes: { class: `${id}-button-wrapper` } });

  const gridUtilityContainers = {
    main: buildGridUtilityContainer('main-grid-utility-container'),
    tracking: buildGridUtilityContainer('tracking-grid-utility-container')
  };

  mainGridView.attachTo(boardContainer);
  fleetView.attachMainFleetTo(gridUtilityContainers.main);
  mainGridView.attachToWrapper(gridUtilityContainers.main);
  trackingGridView.attachToWrapper(gridUtilityContainers.tracking);
  gridUtilityContainers.main.append(buttonsContainer);

  trackingGridView.attachTo(boardContainer);

  const buttonsManager = {
    wrappers: {},
    container: buttonsContainer,
    getWrapper: (id) => {
      if (!buttonsManager.wrappers[id]) {
        const wrapper = buildButtonWrapper(id);
        buttonsManager.container.append(wrapper);
        buttonsManager.wrappers[id] = wrapper;
      }
      return buttonsManager.wrappers[id];
    },
    updateButton: (id, newButton) => {
      const wrapper = buttonsManager.getWrapper(id);
      wrapper.textContent = '';
      wrapper.append(newButton);
    },
    removeButton: (id) => {
      if (buttonsManager.wrappers[id]) buttonsManager.wrappers[id].remove();
    }
  };
  const rotateShipButtonController = {
    update: (scopedShipID) => {
      const btn = fleetView.getRotateShipButton(scopedShipID);
      buttonsManager.updateButton(`rotate-ship`, btn);
    },
    clearWrapper: () => (buttonsManager.getWrapper(`rotate-ship`).textContent = '')
  };

  const submitPlacementsButtonController = {
    init: () =>
      buttonsManager.updateButton(
        `submit-placements`,
        mainGridView.elements.getSubmitPlacementsButton()
      )
  };

  const trackingGrid = {
    setFleet: (opponentTrackingFleet) =>
      gridUtilityContainers.tracking.append(opponentTrackingFleet),
    hide: () => trackingGridView.hide(),
    show: () => trackingGridView.show(),
    enable: () => trackingGridView.enable(),
    disable: () => trackingGridView.disable(),
    attachToWrapper: (element) => trackingGridView.attachToWrapper(element)
  };

  return {
    setContainer: (container) => (displayContainer = container),
    display: () => displayContainer.append(boardContainer),
    remove: () => boardContainer.remove(),
    trackingGrid,
    buttonsManager,
    buttons: {
      rotateShip: {
        update: (scopedShipID) => rotateShipButtonController.update(scopedShipID),
        clearWrapper: () => rotateShipButtonController.clearWrapper()
      },
      submitPlacements: {
        init: () => submitPlacementsButtonController.init()
      }
    }
  };
};
