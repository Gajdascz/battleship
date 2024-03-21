import { ORIENTATIONS } from '../../../../../../Utility/constants/common';
import { COMMON_GRID } from '../../../../common/gridConstants';
import { MOUSE_EVENTS } from '../../../../../../Utility/constants/dom/domEvents';
import {
  convertToInternalFormat,
  convertToDisplayFormat
} from '../../../../../../Utility/utils/coordinatesUtils';

const CLASSES = {
  PLACED_SHIP: 'placed-ship',
  INVALID_PLACEMENT: 'invalid-placement',
  VALID_PLACEMENT: 'valid-placement'
};

/**
 * Initializes a PreviewManager which provides the interface with a real-time preview depicting a ships potential placement at a given location within the grid.
 *
 * @param {Object} detail Initialization detail.
 * @param {HTMLElement} gridElement HTML element representing the placement grid interface.
 * @param {number} maxVertical The maximum vertical value of the grid interface.
 * @param {number} maxHorizontal The maximum horizontal value of the grid interface.
 * @param {string} letterAxis Defines the grid axis which is labeled using letters.
 * @param {function} getCell Function to retrieve specific cell within the provided grid element.
 * @returns {Object} Interface for managing the preview display.
 */
export const PreviewManager = ({
  gridElement = null,
  maxVertical = null,
  maxHorizontal = null,
  letterAxis = null,
  getCell = null
} = {}) => {
  const currentTarget = { coordinates: null };
  const grid = {
    element: gridElement,
    maxVertical,
    maxHorizontal,
    letterAxis,
    getCell
  };
  const currentShip = { orientation: null, length: null };

  /**
   * Calculates and returns a list of cells for placement preview based on the starting cell and ship orientation.
   * It considers the ship's orientation (vertical/horizontal) and length to determine which cells will be occupied.
   * @param {string} startingCoordinates String representation of the cell coordinates where the preview starts.
   * @returns {array} Array of valid cells for preview.
   */
  const calculateCells = (startingCoordinates) => {
    /**
     * Dynamically calculates the valid cells a ship can occupy.
     * Keeps all placement cells within the bounds of the grid.
     *
     * @param {number} start Starting cell row or column.
     * @param {number} length Selected Ship's length.
     * @param {number} max Grid's maximum row or column.
     * @returns {object} Starting and Ending row or column.
     */
    const getStartEnd = (start, length, max) => {
      const end = Math.min(start + length - 1, max);
      return {
        start: Math.max(end - length + 1, 0),
        end
      };
    };
    const isVertical = currentShip.orientation === ORIENTATIONS.VERTICAL;
    const verticalStrategy = (index, coordinates) =>
      convertToDisplayFormat(index, coordinates[1], grid.letterAxis);
    const horizontalStrategy = (index, coordinates) =>
      convertToDisplayFormat(coordinates[0], index, grid.letterAxis);
    const cells = [];
    const coordinates = convertToInternalFormat(startingCoordinates);
    const startMax = isVertical
      ? { max: grid.maxVertical, startCoordinate: coordinates[0] }
      : { max: grid.maxHorizontal, startCoordinate: coordinates[1] };
    const { start, end } = getStartEnd(startMax.startCoordinate, currentShip.length, startMax.max);
    const strategy = isVertical ? verticalStrategy : horizontalStrategy;
    for (let i = start; i <= end; i++) {
      cells.push(strategy(i, coordinates));
    }
    return cells;
  };

  /**
   * Dynamically displays the placement preview in provided grid interface.
   *
   * @param {string[]} cells Array of display-formatted coordinates.
   */
  const displayPlacementPreview = (cells) => {
    const isAtopAnotherShip = (cell) => cell.classList.contains(CLASSES.PLACED_SHIP);
    clearPlacementPreview(grid.element);
    cells.forEach((coordinates) => {
      const cell = grid.getCell(coordinates);
      if (isAtopAnotherShip(cell)) cell.classList.add(CLASSES.INVALID_PLACEMENT);
      else cell.classList.add(CLASSES.VALID_PLACEMENT);
    });
  };

  /**
   * Clears all placement preview stylings from the grid interface.
   */
  const clearPlacementPreview = () => {
    grid.element
      .querySelectorAll(`.${CLASSES.VALID_PLACEMENT}, .${CLASSES.INVALID_PLACEMENT}`)
      .forEach((cell) => {
        cell.classList.remove(CLASSES.VALID_PLACEMENT, CLASSES.INVALID_PLACEMENT);
      });
  };

  /**
   * Calculates and displays the placement preview cells.
   *
   * @param {string} targetCoordinates Display-formatted coordinates of target cell.
   */
  const processPreview = (targetCoordinates) => {
    const cells = calculateCells(targetCoordinates);
    displayPlacementPreview(cells);
  };

  /**
   * Listens for mouse-over events within the given grid interface to update an display the preview in real-time.
   *
   * @param {Event} e DOM-level mouse-over event.
   */
  const handleMouseOver = (e) => {
    if (!currentShip.orientation) return;
    const target = e.target;
    if (!target.classList.contains(COMMON_GRID.CLASSES.CELL)) {
      currentTarget.coordinates = null;
      clearPlacementPreview();
    }
    const targetCell = e.target.closest(COMMON_GRID.CELL_SELECTOR);
    if (!targetCell) return;
    currentTarget.coordinates = targetCell.dataset.coordinates;
    if (!currentTarget.coordinates) return;
    processPreview(currentTarget.coordinates);
  };

  return {
    enable: () => {
      grid.element.addEventListener(MOUSE_EVENTS.OVER, handleMouseOver);
    },
    disable: () => {
      clearPlacementPreview();
      grid.element.removeEventListener(MOUSE_EVENTS.OVER, handleMouseOver);
    },
    updateOrientation: (newOrientation) => {
      clearPlacementPreview();
      currentShip.orientation = newOrientation;
      if (!currentTarget.coordinates) return;
      processPreview(currentTarget.coordinates);
    },
    setCurrentEntity: ({ length, orientation }) => {
      clearPlacementPreview();
      currentShip.length = length;
      currentShip.orientation = orientation;
    },
    initializeGrid: ({ element, maxVertical, maxHorizontal, letterAxis, getCell }) => {
      grid.element = element;
      grid.maxVertical = maxVertical;
      grid.maxHorizontal = maxHorizontal;
      grid.letterAxis = letterAxis;
      grid.getCell = getCell;
    },
    reset: () => {
      grid.element?.removeEventListener(MOUSE_EVENTS.OVER, handleMouseOver);
      grid.element = null;
      grid.maxVertical = null;
      grid.maxHorizontal = null;
      grid.letterAxis = null;
      grid.getCell = null;
      currentShip.length = null;
      currentShip.orientation = null;
    }
  };
};
