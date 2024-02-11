export const MainGridView = (mainGridElement) => {
  const _mainGridElement = mainGridElement;

  const getCell = (row, col) => _mainGridElement.querySelector(`[data-coordinates="${row + col}"]`);
  const isAtopAnotherShip = (cell) => cell.classList.contains('placed-ship');
  const getShipPlacementCells = (shipID) =>
    _mainGridElement.querySelectorAll(`[data-placed-ship-name=${shipID}]`);

  const displayPlacementPreview = (cells) => {
    clearPlacementPreview(_mainGridElement);
    cells.forEach(({ row, col }) => {
      const cell = getCell(row, col);
      if (isAtopAnotherShip(cell)) cell.classList.add('invalid-placement');
      else cell.classList.add('valid-placement');
    });
  };

  const clearPlacementPreview = () => {
    _mainGridElement.querySelectorAll('.valid-placement, .invalid-placement').forEach((cell) => {
      cell.classList.remove('valid-placement', 'invalid-placement');
    });
  };

  const displayPlacedShip = (placementCells, shipID) => {
    clearPlacementPreview();
    placementCells.forEach((cell) => {
      cell.classList.replace('valid-placement', 'placed-ship');
      cell.setAttribute('data-placed-ship-name', shipID);
      cell.textContent = shipID.charAt(0).toUpperCase();
    });
  };

  const clearPlacedShip = (shipID) => {
    const shipCells = getShipPlacementCells(shipID);
    shipCells.forEach((cell) => {
      cell.classList.remove('placed-ship');
      cell.removeAttribute('data-placed-ship-name');
      cell.textContent = '';
    });
  };

  const displayShipHit = (coordinates) =>
    getCell(coordinates[0], coordinates[1]).classList.add('main-grid-hit-marker');

  const renderGrid = (container) => container.append(_mainGridElement);

  return {
    renderGrid,
    displayPlacementPreview,
    clearPlacementPreview,
    displayPlacedShip,
    clearPlacedShip,
    displayShipHit
  };
};
