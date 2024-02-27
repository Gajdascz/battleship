import { COMMON_ELEMENTS } from '../../../Utility/constants/dom/elements';
import { buildUIElement } from '../../../Utility/uiBuilderUtils/uiBuilders';
import './board-style.css';

export const BoardView = (scopedID, playerName, { mainGridView, trackingGridView, fleetView }) => {
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

  const buttonsControllers = {
    rotateShip: {
      update: (scopedShipID) => {
        const btn = fleetView.getRotateShipButton(scopedShipID);
        buttonsManager.updateButton(`rotate-ship`, btn);
      }
    },
    submitPlacements: {
      staticButton: mainGridView.elements.getSubmitPlacementsButton(),
      init: () =>
        buttonsManager.updateButton(
          `submit-placements`,
          buttonsControllers.submitPlacements.staticButton
        )
    }
  };
  const AIView = {
    view: null,
    setView: (newView) => (AIView.view = newView),
    display: () => trackingGridView.attachToWrapper(AIView.getGridElement())
  };

  return {
    attachTo: (container) => container.append(boardContainer),
    remove: () => boardContainer.remove(),
    trackingGrid: {
      setFleet: (opponentTrackingFleet) => trackingGridView.attachToWrapper(opponentTrackingFleet),
      hide: () => trackingGridView.hide(),
      show: () => trackingGridView.show(),
      enable: () => trackingGridView.enable(),
      disable: () => trackingGridView.disable(),
      attachToUtilityContainer: (element) => gridUtilityContainers.tracking.append(element),
      attachToWrapper: (element) => trackingGridView.attachToWrapper(element)
    },
    AIView,
    buttons: buttonsControllers
  };
};
