import { COMMON_ELEMENTS } from '../../../utility/constants/dom/elements';
import { buildUIElement } from '../../../utility/uiBuilderUtils/uiBuilders';
import './board-style.css';

export const BoardView = (scopedID, { mainGridView, trackingGridView, fleetView }) => {
  const BOARD_CONTAINER_CLASS = 'board';
  const BOARD_BUTTONS_CONTAINER_CLASS = 'board-buttons-container';
  const boardContainer = buildUIElement(COMMON_ELEMENTS.DIV, {
    attributes: { class: BOARD_CONTAINER_CLASS, id: scopedID }
  });
  const buttonsContainer = buildUIElement(COMMON_ELEMENTS.DIV, {
    attributes: { class: BOARD_BUTTONS_CONTAINER_CLASS }
  });

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
      staticButton: mainGridView.submitPlacementsButton.getElement(),
      init: () =>
        buttonsManager.updateButton(
          `submit-placements`,
          buttonsControllers.submitPlacements.staticButton
        ),
      enable: () => mainGridView.submitPlacementsButton.enable(),
      disable: () => mainGridView.submitPlacementsButton.disable()
    }
  };

  return {
    attachTo: (container) => container.append(boardContainer),
    remove: () => boardContainer.remove(),
    trackingGrid: {
      setFleet: (opponentTrackingFleet) => trackingGridView.attachToWrapper(opponentTrackingFleet),
      hide: () => trackingGridView.hide(),
      display: () => trackingGridView.display(),
      enable: () => trackingGridView.enable(),
      disable: () => trackingGridView.disable(),
      attachToUtilityContainer: (element) => gridUtilityContainers.tracking.append(element),
      attachToWrapper: (element) => trackingGridView.attachToWrapper(element)
    },
    buttons: buttonsControllers
  };
};
