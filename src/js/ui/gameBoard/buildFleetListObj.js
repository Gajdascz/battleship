import { ELEMENT_TYPES, FLEET_LIST, GRID } from '../common/uiConstants';
import { uiObj } from '../common/uiUtility';
/**
 * @module fleetListObjs.js
 * Provides the structured object for the provided grid's fleet list to create an HTML Element.
 *
 * Expected gridType parameter includes 'main-grid' or 'tracking-grid'.
 */

// Checks if specified grid type is 'main-grid'
const isMain = (gridType) => gridType === GRID.TYPES.MAIN;

/**
 * Creates top-level container for the grid's fleet list.
 *
 * @param {string} gridType Grid to create container for.
 * @returns {Object} Contains details for grid container.
 */
const gridFleetListContainerObj = (gridType) =>
  uiObj(ELEMENT_TYPES.DIV, {
    attributes: {
      class: isMain(gridType)
        ? FLEET_LIST.MAIN.CONTAINER_CLASS
        : FLEET_LIST.TRACKING.CONTAINER_CLASS
    }
  });

/**
 * Creates container for the list of ships in the current game.
 *
 * @param {string} gridType Grid to create ship list container for.
 * @returns {Object} Contains details for list of ships.
 */
const fleetShipListContainerObj = (gridType) =>
  uiObj(ELEMENT_TYPES.DIV, {
    attributes: { class: isMain(gridType) ? FLEET_LIST.MAIN.CLASS : FLEET_LIST.TRACKING.CLASS }
  });

/**
 * Creates the header for the grid's fleet list.
 *
 * @param {string} gridType Grid to create header for.
 * @returns {Object} Contains details for the header of the ship list.
 */
const listContainerHeaderObj = (gridType) =>
  uiObj(ELEMENT_TYPES.PARAGRAPH, {
    text: isMain(gridType) ? FLEET_LIST.MAIN.HEADER : FLEET_LIST.TRACKING.HEADER,
    attributes: {
      class: isMain(gridType)
        ? FLEET_LIST.MAIN.CONTAINER_HEADER_CLASS
        : FLEET_LIST.TRACKING.CONTAINER_HEADER_CLASS
    }
  });

/**
 * Creates the button container for the main grid's fleet list.
 *
 * @returns {Object} Contains details for the button container
 */
const buttonContainerObj = () =>
  uiObj(ELEMENT_TYPES.DIV, {
    attributes: { class: FLEET_LIST.MAIN.BUTTONS_CONTAINER_CLASS }
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
