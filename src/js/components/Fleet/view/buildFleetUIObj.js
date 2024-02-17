import {
  buildUIObj,
  buildElementFromUIObj,
  buildUIElement
} from '../../../utility/uiBuilderUtils/uiBuilders';
import { COMMON_ELEMENTS } from '../../../utility/constants/dom/elements';
import { MAIN_FLEET, TRACKING_FLEET } from '../../../utility/constants/components/fleet';
/**
 * @module fleetListObjs.js
 * Provides the structured object for the provided grid's fleet list to create an HTML Element.
 *
 * Expected gridType parameter includes 'main-grid' or 'tracking-grid'.
 */

/**
 * Creates top-level container for the grid's fleet list.
 *
 * @returns {Object} Contains details for grid container.
 */
const buildFleetContainerObj = () => ({
  mainFleetContainer: buildUIObj(COMMON_ELEMENTS.DIV, {
    attributes: {
      class: MAIN_FLEET.TYPE
    }
  }),
  trackingFleetContainer: buildUIObj(COMMON_ELEMENTS.DIV, {
    attributes: {
      class: TRACKING_FLEET.TYPE
    }
  })
});

/**
 * Creates container for the list of ships in the current game.
 *
 * @returns {Object} Contains details for list of ships.
 */
const buildShipListObj = () => ({
  mainShipList: buildUIObj(COMMON_ELEMENTS.DIV, {
    attributes: {
      class: MAIN_FLEET.CLASSES.SHIP_LIST
    }
  }),
  trackingShipList: buildUIObj(COMMON_ELEMENTS.DIV, {
    attributes: {
      class: TRACKING_FLEET.CLASSES.SHIP_LIST
    }
  })
});

/**
 * Creates the header for the grid's fleet list.
 *
 * @param {string} gridType Grid to create header for.
 * @returns {Object} Contains details for the header of the ship list.
 */
const buildFleetHeaderObj = () => ({
  mainFleetHeader: buildUIObj(COMMON_ELEMENTS.PARAGRAPH, {
    text: MAIN_FLEET.PROPERTIES.HEADER_TEXT,
    attributes: {
      class: MAIN_FLEET.CLASSES.HEADER
    }
  }),
  trackingFleetHeader: buildUIObj(COMMON_ELEMENTS.PARAGRAPH, {
    text: TRACKING_FLEET.PROPERTIES.HEADER_TEXT,
    attributes: {
      class: TRACKING_FLEET.CLASSES.HEADER
    }
  })
});

/**
 * Creates the button container for the main grid's fleet list.
 *
 * @returns {Object} Contains details for the button container
 */
const buildButtonContainerObj = () =>
  buildUIObj(COMMON_ELEMENTS.DIV, {
    attributes: { class: MAIN_FLEET.CLASSES.BUTTONS_CONTAINER }
  });

/**
 * Creates the grid's fleet list structure and components.
 *
 * @param {string} gridType Grid to build a fleet list for.
 * @returns {Object} Contains details and structure for the grid's fleet list.
 */
export const buildFleetUIObj = () => {
  const { mainFleetContainer, trackingFleetContainer } = buildFleetContainerObj();
  const { mainFleetHeader, trackingFleetHeader } = buildFleetHeaderObj();
  const { mainShipList, trackingShipList } = buildShipListObj();
  const buttonContainerObj = buildButtonContainerObj();
  mainFleetContainer.children = [mainFleetHeader, mainShipList, buttonContainerObj];
  trackingFleetContainer.children = [trackingFleetHeader, trackingShipList];
  const mainFleetElement = buildElementFromUIObj(mainFleetContainer);
  const trackingFleetElement = buildElementFromUIObj(trackingFleetContainer);
  const buttonContainerElement = mainFleetElement.querySelector(
    `.${MAIN_FLEET.CLASSES.BUTTONS_CONTAINER}`
  );
  buildUIElement(COMMON_ELEMENTS.DIV, { attributes: { class: 'rotate-button-wrapper' } });
  const rotateShipWrapperElement = buildUIElement(COMMON_ELEMENTS.DIV, {
    attributes: { class: 'rotate-button-wrapper' }
  });

  buttonContainerElement.append(rotateShipWrapperElement);
  return {
    mainFleetElement,
    trackingFleetElement,
    buttonContainerElement,
    rotateShipWrapperElement
  };
};
