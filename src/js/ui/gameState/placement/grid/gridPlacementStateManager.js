/**
 * Handles all logic to handle events related to placing a ship in the main grid.
 * Provides logic to Process placements, Show placement preview, Clear placement preview,
 * and remain updated when ships are selected and rotated.
 *
 * @param {object} mainGrid   - HTML representation of the Battleship main grid.
 * @param {string} letterAxis - Grid axis to use letter labels on.
 * @returns {object} - Provides functions for handling events.
 */
export default function gridPlacementStateManager(mainGrid, letterAxis) {
  const _grid = mainGrid;
  const _ship = { selected: null };
  const _letterAxis = letterAxis;
  const _maxVertical = _grid.querySelectorAll('.board-row').length - 1;
  const _maxHorizontal = _grid.querySelector('.board-row').querySelectorAll('.grid-cell').length - 1;
  const ACHARCODE = 'A'.charCodeAt();

  const setSelectedShip = (selectedShip) => (_ship.selected = selectedShip);
  const isShipSelected = () => _ship.selected !== null;
  const isValidPlacement = (mainGrid) => mainGrid.querySelector('.invalid-placement') === null;
  const getLetter = (num) => String.fromCharCode(num);

  /**
   * Normalizes input coordinates for processing.
   * Provides the relevant character code based on defined letter axis.
   * @param {string} coordinates - Represents grid coordinates eg. 'A9' or '9A'.
   * @returns {object} - With row and column properties for easy processing.
   */
  const normalizeCoordinates = (coordinates) => {
    let row, column;
    if (_letterAxis === 'row') {
      const match = coordinates.match(/^([A-Za-z]+)(\d+)$/);
      if (match) {
        row = match[1].charCodeAt(0) - ACHARCODE;
        column = +match[2];
      }
    } else {
      const match = coordinates.match(/^(\d+)([A-Za-z]+)$/);
      if (match) {
        row = +match[1];
        column = match[2].charCodeAt(0) - ACHARCODE;
      }
    }
    return { row, column };
  };

  // Formats processed coordinates based on letter axis.
  const formatCoordinates = (row, column) => {
    return _letterAxis === 'row' ? `${getLetter(row + ACHARCODE)}${column}` : `${row}${getLetter(column + ACHARCODE)}`;
  };

  /**
   * Provides valid preview starting and ending cells.
   * Returns placement preview cells based on starting cell's relevant row or column,
   * the ship's length, and the grid's relevant maximum boundary.
   * @param {integer} start - Starting cell row or column.
   * @param {integer} length      - Selected Ship's length.
   * @param {integer} max         - Grid's maximum row or column.
   * @returns {object} - Starting and Ending row or column.
   */
  const getStartEnd = (start, length, max) => {
    const end = Math.min(start + length - 1, max);
    return {
      start: Math.max(end - length + 1, 0),
      end
    };
  };

  /**
   * Provides the relevant function to pass correct parameters to coordinate formatting function based on ship's orientation.
   * @param {string} orientation - String defining ship's current orientation.
   * @returns {function} - Function relevant to ship's orientation; verticalStrategy or horizontalStrategy
   */
  const getOrientationStrategy = (orientation) => (orientation === 'vertical' ? verticalStrategy : horizontalStrategy);
  const verticalStrategy = (index, coordinates) => formatCoordinates(index, coordinates.column);
  const horizontalStrategy = (index, coordinates) => formatCoordinates(coordinates.row, index);

  /**
   * Calculates and returns a list of cells for placement preview based on the starting cell and ship orientation.
   * It considers the ship's orientation (vertical/horizontal) and length to determine which cells will be occupied.
   * @param {string} startingCoordinates - String representation of the cell coordinates where the preview starts.
   * @returns {array} - Array of valid cells for preview.
   */
  const calculateCells = (startingCoordinates) => {
    const cells = [];
    const coordinates = normalizeCoordinates(startingCoordinates);
    const max = _ship.selected.orientation === 'vertical' ? _maxVertical : _maxHorizontal;
    const startCoordinate = _ship.selected.orientation === 'vertical' ? coordinates.row : coordinates.column;
    const { start, end } = getStartEnd(startCoordinate, _ship.selected.length, max);
    const strategy = getOrientationStrategy(_ship.selected.orientation);
    for (let i = start; i <= end; i++) cells.push(strategy(i, coordinates));
    return cells;
  };

  /**
   * Provides graphical representation preview of ship placement in grid.
   * @param {string} startingCell - String representation of starting cell coordinates.
   */
  const showPlacementPreview = (startingCell) => {
    if (!isShipSelected()) return;
    startingCell.classList.add('current-starting-cell');
    const cells = calculateCells(startingCell.dataset.coordinates);
    cells.forEach((cell) => {
      const gridCell = _grid.querySelector(`[data-coordinates="${cell}"]`);
      if (gridCell.classList.contains('placed-ship')) gridCell.classList.add('invalid-placement');
      else gridCell.classList.add('valid-placement');
    });
  };
  // Clears placement preview in grid.
  const clearPlacementPreview = () => {
    _grid.querySelectorAll('.current-starting-cell, .valid-placement, .invalid-placement').forEach((cell) => {
      cell.classList.remove('current-starting-cell', 'valid-placement', 'invalid-placement');
    });
  };
  /**
   * Keeps the grid display updated when a selected ship's orientation is changed.
   * @param {event} e - shipOrientationChanged event details for ship orientation change.
   */
  const updateGridOnOrientationChange = (e) => {
    if (!isShipSelected()) return;
    const { name, newOrientation } = e.detail;
    if (name === _ship.selected.name) {
      _ship.selected.orientation = newOrientation;
      const startingCell = _grid.querySelector('.current-starting-cell');
      if (startingCell) {
        clearPlacementPreview(_grid);
        showPlacementPreview(startingCell);
      }
    }
  };

  /**
   * Clears a placed ship from the grid when reselected for placement.
   * @param {string} shipName - Name of ship to be cleared.
   */
  const clearPlacedShip = (shipName) => {
    const shipCells = _grid.querySelectorAll(`[data-placed-ship-name=${shipName}]`);
    shipCells.forEach((cell) => {
      cell.classList.remove('placed-ship');
      cell.removeAttribute('data-placed-ship-name');
      cell.textContent = '';
    });
  };

  /**
   * Updates manager's selected ship reference and grid display if it's already placed.
   * @param {event} e - shipSelected event details containing selected ship information.
   */
  const shipSelected = (e) => {
    setSelectedShip(e.detail);
    if (_grid.querySelector(`[data-placed-ship-name=${_ship.selected.name}]`)) clearPlacedShip(_ship.selected.name);
  };

  /**
   * Dispatches shipPlaced event details for further processing.
   * Provides placement coordinates, name of ship, and the ship's HTML element.
   * @param {string[]} placedCoordinates - Array of string representations of ship placement coordinates.
   * @dispatches -shipPlaced event at document level.
   */
  const dispatchShipPlacedEvent = (placedCoordinates) =>
    document.dispatchEvent(
      new CustomEvent('shipPlaced', {
        detail: {
          placedCoordinates,
          shipName: _ship.selected.name,
          shipElement: _ship.selected.element
        }
      })
    );

  /**
   * Updates grid cells when a ship is placed.
   * @param {element[]} placementCells - Array of grid cell html elements.
   */
  const setPlacedShip = (placementCells) => {
    placementCells.forEach((cell) => {
      cell.classList.replace('valid-placement', 'placed-ship');
      cell.setAttribute('data-placed-ship-name', _ship.selected.name);
      cell.textContent = _ship.selected.name.charAt(0).toUpperCase();
    });
  };

  /**
   * Processes ship placement request, updates selected ship reference, and dispatches event.
   * @param {event} e - Click event triggering ship placement request.
   */
  const processPlacementRequest = (e) => {
    if (!isShipSelected()) return;
    if (e.button === 0 && _ship.selected && isValidPlacement(_grid)) {
      const placementCells = [..._grid.querySelectorAll('.valid-placement')];
      setPlacedShip(placementCells);
      dispatchShipPlacedEvent(placementCells.map((cell) => cell.dataset.coordinates));
      _ship.selected = null;
    }
  };

  return {
    get grid() {
      return _grid;
    },
    shipSelected,
    showPlacementPreview,
    clearPlacementPreview,
    updateGridOnOrientationChange,
    processPlacementRequest
  };
}
