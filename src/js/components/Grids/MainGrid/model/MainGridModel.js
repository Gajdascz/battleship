import { createIdentity } from '../../../../utility/utils/createIdentity';
import {
  copyGrid,
  isWithinGrid,
  getValueAt,
  createGrid
} from '../../../../utility/utils/gridUtils';
import { LETTER_AXES, ORIENTATIONS, STATUSES } from '../../../../utility/constants/common';
import { getRelativeOrientation } from '../../../../utility/utils/coordinatesUtils';

export const MainGridModel = (
  gridScope,
  { numberOfRows = 10, numberOfCols = 10, letterAxis = LETTER_AXES.ROW } = {}
) => {
  if (numberOfRows > 26 || numberOfCols > 26)
    throw new Error('Board cannot have more than 25 rows or columns.');
  const { scope, id, scopedID } = createIdentity({
    scope: gridScope,
    name: 'mainGrid'
  });
  const mainGrid = createGrid(numberOfRows, numberOfCols, STATUSES.EMPTY);
  const ltrAxis = letterAxis;
  const maxVertical = mainGrid.length - 1;
  const maxHorizontal = mainGrid[0].length - 1;

  const isInBounds = (coordinates) => isWithinGrid(mainGrid, coordinates);
  const isVertical = (orientation) => orientation === ORIENTATIONS.VERTICAL;

  const getCellStatus = (coordinates) => getValueAt(mainGrid, coordinates);
  const setCellStatus = (coordinates, status) =>
    (mainGrid[coordinates[0]][coordinates[1]] = status);

  const isPlacementValid = (start, end, orientation) => {
    if (!isInBounds(start) || !isInBounds(end)) return false;
    if (isVertical(orientation)) {
      for (let i = start[1]; i <= end[1]; i++) {
        const status = getCellStatus([start[0], i]);
        if (status !== STATUSES.EMPTY) return false;
      }
    } else {
      for (let i = start[0]; i <= end[0]; i++) {
        const status = getCellStatus([i, start[1]]);
        if (status !== STATUSES.EMPTY) return false;
      }
    }
    return true;
  };

  const place = ({ start, end, orientation = null }) => {
    console.log(start, end);
    let verifiedOrientation = orientation;
    if (orientation === null) verifiedOrientation = getRelativeOrientation(start, end, false);
    if (isPlacementValid(start, end, verifiedOrientation)) {
      if (verifiedOrientation === ORIENTATIONS.VERTICAL) {
        for (let i = start[0]; i <= end[0]; i++) setCellStatus([i, start[1]], STATUSES.OCCUPIED);
      } else {
        for (let i = start[1]; i <= end[1]; i++) setCellStatus([start[0], i], STATUSES.OCCUPIED);
      }
    } else return false;
    return true;
  };

  function incomingAttack(coordinates) {
    if (!isInBounds(coordinates)) return false;
    const cellStatus = getCellStatus(coordinates);
    if (cellStatus.status === STATUSES.OCCUPIED) {
      setCellStatus(coordinates, STATUSES.HIT);
      return STATUSES.HIT;
    } else return STATUSES.MISS;
  }

  return {
    place,
    incomingAttack,
    isBoard: () => true,
    getMainGrid: () => copyGrid(mainGrid),
    getLetterAxis: () => ltrAxis,
    getMaxVertical: () => maxVertical,
    getMaxHorizontal: () => maxHorizontal,
    getDimensions: () => ({ width: mainGrid[0].length, height: mainGrid.length }),
    getID: () => id,
    getScope: () => scope,
    getScopedID: () => scopedID,
    reset() {
      mainGrid.length = 0;
      mainGrid.push(...createGrid(maxVertical, maxHorizontal));
    }
  };
};
