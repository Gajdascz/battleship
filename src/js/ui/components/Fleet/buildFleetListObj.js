import { ELEMENT_TYPES, FLEET_LIST, GRID } from '../../common/constants/baseConstants';
import { buildUIObj } from '../../common/utility/uiBuilders';
/**
 * @module fleetListObjs.js
 * Provides the structured object for the provided grid's fleet list to create an HTML Element.
 *
 * Expected gridType parameter includes 'main-grid' or 'tracking-grid'.
 */

// Checks if specified grid type is 'main-grid'
const isMain = (gridType) => gridType === GRID.COMMON.CLASSES.GRID_TYPES.MAIN;

/**
 * Creates top-level container for the grid's fleet list.
 *
 * @param {string} gridType Grid to create container for.
 * @returns {Object} Contains details for grid container.
 */
const gridFleetListContainerObj = (gridType) =>
  buildUIObj(ELEMENT_TYPES.DIV, {
    attributes: {
      class: isMain(gridType)
        ? FLEET_LIST.MAIN.CLASSES.CONTAINER
        : FLEET_LIST.TRACKING.CLASSES.CONTAINER
    }
  });

/**
 * Creates container for the list of ships in the current game.
 *
 * @param {string} gridType Grid to create ship list container for.
 * @returns {Object} Contains details for list of ships.
 */
const fleetShipListContainerObj = (gridType) =>
  buildUIObj(ELEMENT_TYPES.DIV, {
    attributes: {
      class: isMain(gridType)
        ? FLEET_LIST.COMMON.CLASSES.FLEET_LIST_TYPES.MAIN
        : FLEET_LIST.COMMON.CLASSES.FLEET_LIST_TYPES.TRACKING
    }
  });

/**
 * Creates the header for the grid's fleet list.
 *
 * @param {string} gridType Grid to create header for.
 * @returns {Object} Contains details for the header of the ship list.
 */
const listContainerHeaderObj = (gridType) =>
  buildUIObj(ELEMENT_TYPES.PARAGRAPH, {
    text: isMain(gridType) ? FLEET_LIST.MAIN.TEXTS.HEADER : FLEET_LIST.TRACKING.TEXTS.HEADER,
    attributes: {
      class: isMain(gridType)
        ? FLEET_LIST.MAIN.CLASSES.HEADER_CONTAINER
        : FLEET_LIST.TRACKING.CLASSES.HEADER_CONTAINER
    }
  });

/**
 * Creates the button container for the main grid's fleet list.
 *
 * @returns {Object} Contains details for the button container
 */
const buttonContainerObj = () =>
  buildUIObj(ELEMENT_TYPES.DIV, {
    attributes: { class: FLEET_LIST.MAIN.CLASSES.BUTTONS_CONTAINER }
  });

/**
 * Creates the grid's fleet list structure and components.
 *
 * @param {string} gridType Grid to build a fleet list for.
 * @returns {Object} Contains details and structure for the grid's fleet list.
 */
export const buildFleetListObj = (gridType) => {
  const container = gridFleetListContainerObj(gridType);
  const header = listContainerHeaderObj(gridType);
  const shipListContainer = fleetShipListContainerObj(gridType);
  container.children = [
    header,
    shipListContainer,
    ...(isMain(gridType) ? [buttonContainerObj()] : [])
  ];
  return container;
};
