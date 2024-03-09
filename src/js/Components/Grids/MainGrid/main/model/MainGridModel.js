import { createIdentity } from '../../../../../Utility/utils/createIdentity';
import {
  copyGrid,
  isWithinGrid,
  getValueAt,
  createGrid
} from '../../../../../Utility/utils/gridUtils';
import { LETTER_AXES, STATUSES } from '../../../../../Utility/constants/common';
import { EntityPlacementManager } from './EntityPlacementManager';

export const MainGridModel = ({
  numberOfRows = 10,
  numberOfCols = 10,
  letterAxis = LETTER_AXES.ROW
} = {}) => {
  if (numberOfRows > 26 || numberOfCols > 26)
    throw new Error('Board cannot have more than 26 rows or columns.');
  const mainGrid = createGrid(numberOfRows, numberOfCols, { status: STATUSES.EMPTY, id: null });
  const maxVertical = mainGrid.length - 1;
  const maxHorizontal = mainGrid[0].length - 1;

  const isInBounds = (coordinates) => isWithinGrid(mainGrid, coordinates);
  const valueAt = (coordinates) => getValueAt(mainGrid, coordinates);

  const setCellStatus = (coordinates, status) => {
    const [row, col] = coordinates;
    mainGrid[row][col].status = status;
  };

  const entityPlacementManager = EntityPlacementManager({
    mainGrid,
    valueAt,
    setCellStatus,
    isInBounds
  });

  const processIncomingAttack = (coordinates) => {
    const cell = valueAt(coordinates);
    if (cell.status === STATUSES.OCCUPIED) setCellStatus(coordinates, STATUSES.HIT);
    else setCellStatus(coordinates, STATUSES.MISS);
    return { coordinates, value: valueAt(coordinates) };
  };

  return {
    place: (coordinates, id) => entityPlacementManager.placeEntity(coordinates, id),
    removePlacedEntity: (id) => entityPlacementManager.removePlacedEntity(id),
    isEntityPlaced: (id) => entityPlacementManager.isEntityPlaced(id),
    getEntityPlacements: () => entityPlacementManager.getPlacedEntityMap(),
    processIncomingAttack,
    isInBounds,
    setCellStatus,
    getMainGrid: () => copyGrid(mainGrid),
    getLetterAxis: () => letterAxis,
    getMaxVertical: () => maxVertical,
    getMaxHorizontal: () => maxHorizontal,
    getDimensions: () => ({ width: mainGrid[0].length, height: mainGrid.length }),
    reset() {
      mainGrid.length = 0;
      entityPlacementManager.reset();
      mainGrid.push(...createGrid(numberOfRows, numberOfCols));
    }
  };
};
