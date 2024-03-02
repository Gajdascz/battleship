import { ORIENTATIONS } from '../../../../../../Utility/constants/common';
import { COMMON_GRID } from '../../../../common/gridConstants';
import { MOUSE_EVENTS } from '../../../../../../Utility/constants/dom/domEvents';
import {
  convertToInternalFormat,
  convertToDisplayFormat
} from '../../../../../../Utility/utils/coordinatesUtils';

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
   * @param {string} startingCoordinates - String representation of the cell coordinates where the preview starts.
   * @returns {array} - Array of valid cells for preview.
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
  const displayPlacementPreview = (cells) => {
    const isAtopAnotherShip = (cell) => cell.classList.contains('placed-ship');
    clearPlacementPreview(grid.element);
    cells.forEach((coordinates) => {
      const cell = grid.getCell(coordinates);
      if (isAtopAnotherShip(cell)) cell.classList.add('invalid-placement');
      else cell.classList.add('valid-placement');
    });
  };

  const clearPlacementPreview = () => {
    grid.element.querySelectorAll('.valid-placement, .invalid-placement').forEach((cell) => {
      cell.classList.remove('valid-placement', 'invalid-placement');
    });
  };

  const processPreview = (targetCoordinates) => {
    const cells = calculateCells(targetCoordinates);
    displayPlacementPreview(cells);
  };

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
