import { createIdentity } from '../../../../Utility/utils/createIdentity';
import {
  copyGrid,
  isWithinGrid,
  getValueAt,
  createGrid
} from '../../../../Utility/utils/gridUtils';
import { LETTER_AXES, STATUSES } from '../../../../Utility/constants/common';
import { EntityPlacementManager } from './EntityPlacementManager';

export const MainGridModel = (
  gridScope,
  { numberOfRows = 10, numberOfCols = 10, letterAxis = LETTER_AXES.ROW } = {}
) => {
  if (numberOfRows > 26 || numberOfCols > 26)
    throw new Error('Board cannot have more than 26 rows or columns.');
  const { scope, id, scopedID } = createIdentity({
    scope: gridScope,
    name: 'mainGrid'
  });
  const mainGrid = createGrid(numberOfRows, numberOfCols, STATUSES.EMPTY);
  const maxVertical = mainGrid.length - 1;
  const maxHorizontal = mainGrid[0].length - 1;

  const isInBounds = (coordinates) => isWithinGrid(mainGrid, coordinates);

  const getCellStatus = (coordinates) => {
    if (!isInBounds(coordinates)) return;
    getValueAt(mainGrid, coordinates);
  };
  const setCellStatus = (coordinates, status) => {
    if (!isInBounds(coordinates)) return;
    mainGrid[coordinates[0]][coordinates[1]] = status;
  };
  const entityPlacementManager = EntityPlacementManager({
    mainGrid,
    getCellStatus,
    setCellStatus,
    isInBounds
  });

  function incomingAttack(coordinates) {
    if (!isInBounds(coordinates)) return false;
    const cellStatus = getCellStatus(coordinates);
    if (cellStatus.status === STATUSES.OCCUPIED) {
      setCellStatus(coordinates, STATUSES.HIT);
      return STATUSES.HIT;
    } else return STATUSES.MISS;
  }

  return {
    place: (coordinates, id) => entityPlacementManager.placeEntity(coordinates, id),
    removePlacedEntity: (id) => entityPlacementManager.removePlacedEntity(id),
    isEntityPlaced: (id) => entityPlacementManager.isEntityPlaced(id),
    getPlacedEntities: () => entityPlacementManager.getPlacedEntityMap(),
    incomingAttack,
    isInBounds,
    getCellStatus,
    setCellStatus,
    getMainGrid: () => copyGrid(mainGrid),
    getLetterAxis: () => letterAxis,
    getMaxVertical: () => maxVertical,
    getMaxHorizontal: () => maxHorizontal,
    getDimensions: () => ({ width: mainGrid[0].length, height: mainGrid.length }),
    getID: () => id,
    getScope: () => scope,
    getScopedID: () => scopedID,
    reset() {
      mainGrid.length = 0;
      entityPlacementManager.reset();
      mainGrid.push(...createGrid(numberOfRows, numberOfCols));
    }
  };
};
