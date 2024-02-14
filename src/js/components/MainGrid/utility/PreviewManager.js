import { ORIENTATIONS } from '../../../utility/constants/common';
import { COMMON_GRID } from '../../../utility/constants/components/grids';
import { MOUSE_EVENTS } from '../../../utility/constants/events';
import {
  convertToDisplayFormat,
  convertToInternalFormat
} from '../../../utility/utils/coordinatesUtils';

export const PreviewManager = () => {
  const _currentTarget = { coordinates: null };
  const _grid = {
    element: null,
    maxVertical: null,
    maxHorizontal: null,
    letterAxis: null,
    getCell: null
  };
  const _currentShip = { orientation: null, length: null };

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

    const isVertical = _currentShip.orientation === ORIENTATIONS.VERTICAL;
    const verticalStrategy = (index, coordinates) =>
      convertToDisplayFormat(index, coordinates[1], _grid.letterAxis);
    const horizontalStrategy = (index, coordinates) =>
      convertToDisplayFormat(coordinates[0], index, _grid.letterAxis);
    const cells = [];
    const coordinates = convertToInternalFormat(startingCoordinates);
    const startMax = isVertical
      ? { max: _grid.maxVertical, startCoordinate: coordinates[0] }
      : { max: _grid.maxHorizontal, startCoordinate: coordinates[1] };
    const { start, end } = getStartEnd(startMax.startCoordinate, _currentShip.length, startMax.max);
    const strategy = isVertical ? verticalStrategy : horizontalStrategy;
    for (let i = start; i <= end; i++) {
      cells.push(strategy(i, coordinates));
    }
    return cells;
  };
  const displayPlacementPreview = (cells) => {
    const isAtopAnotherShip = (cell) => cell.classList.contains('placed-ship');
    clearPlacementPreview(_grid.element);
    cells.forEach((coordinates) => {
      const cell = _grid.getCell(coordinates);
      if (isAtopAnotherShip(cell)) cell.classList.add('invalid-placement');
      else cell.classList.add('valid-placement');
    });
  };

  const clearPlacementPreview = () => {
    _grid.element.querySelectorAll('.valid-placement, .invalid-placement').forEach((cell) => {
      cell.classList.remove('valid-placement', 'invalid-placement');
    });
  };

  const processPreview = (targetCoordinates) => {
    const cells = calculateCells(targetCoordinates);
    displayPlacementPreview(cells);
  };

  const handleMouseOver = (e) => {
    if (!_currentShip.orientation) return;
    const target = e.target;
    if (!target.classList.contains(COMMON_GRID.CLASSES.CELL)) clearPlacementPreview();
    const targetCell = e.target.closest(COMMON_GRID.CELL_SELECTOR);
    if (!targetCell) return;
    _currentTarget.coordinates = targetCell.dataset.coordinates;
    processPreview(_currentTarget.coordinates);
  };

  return {
    enable: () => {
      _grid.element.addEventListener(MOUSE_EVENTS.OVER, handleMouseOver);
    },
    disable: () => {
      clearPlacementPreview();
      _grid.element.removeEventListener(MOUSE_EVENTS.OVER, handleMouseOver);
    },
    updateOrientation: (newOrientation) => {
      clearPlacementPreview();
      _currentShip.orientation = newOrientation;
      processPreview(_currentTarget.coordinates);
    },
    setCurrentShip: ({ length, orientation }) => {
      clearPlacementPreview();
      _currentShip.length = length;
      _currentShip.orientation = orientation;
    },
    attachToGrid: ({ element, maxVertical, maxHorizontal, letterAxis, getCell }) => {
      _grid.element = element;
      _grid.maxVertical = maxVertical;
      _grid.maxHorizontal = maxHorizontal;
      _grid.letterAxis = letterAxis;
      _grid.getCell = getCell;
      _grid.element.addEventListener(MOUSE_EVENTS.OVER, handleMouseOver);
    },
    resetManager: () => {
      _grid.element?.removeEventListener(MOUSE_EVENTS.OVER, handleMouseOver);
      _grid.element = null;
      _grid.maxVertical = null;
      _grid.maxHorizontal = null;
      _grid.letterAxis = null;
      _grid.getCell = null;
      _currentShip.length = null;
      _currentShip.orientation = null;
    }
  };
};
