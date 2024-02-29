import { STATUSES, ORIENTATIONS } from '../../../../../Utility/constants/common';
import { getRelativeOrientation } from '../../../../../Utility/utils/coordinatesUtils';

export const EntityPlacementManager = ({ mainGrid, valueAt, setCellStatus, isInBounds }) => {
  const placedEntityCoordinates = new Map();
  const isEntityPlaced = (id) => placedEntityCoordinates.has(id);
  const isVertical = (orientation) => orientation === ORIENTATIONS.VERTICAL;

  const isPlacementValid = (start, end, orientation) => {
    if (!isInBounds(start) || !isInBounds(end)) return false;
    if (isVertical(orientation)) {
      for (let i = start[1]; i <= end[1]; i++) {
        const status = valueAt([start[0], i]).status;
        if (status !== STATUSES.EMPTY) return false;
      }
    } else {
      for (let i = start[0]; i <= end[0]; i++) {
        const status = valueAt([i, start[1]]).status;
        if (status !== STATUSES.EMPTY) return false;
      }
    }
    return true;
  };
  const removePlacedEntity = (entityID) => {
    const coordinates = placedEntityCoordinates.get(entityID);
    if (coordinates) {
      coordinates.forEach(([x, y]) => (mainGrid[x][y] = STATUSES.EMPTY));
      placedEntityCoordinates.delete(entityID);
    }
  };

  const placeEntity = (coordinates, entityID) => {
    const start = coordinates[0];
    const end = coordinates[coordinates.length - 1];
    const entityPlacementCoordinates = [];
    const orientation = getRelativeOrientation(start, end, false);
    if (isPlacementValid(start, end, orientation)) {
      if (orientation === ORIENTATIONS.VERTICAL) {
        for (let i = start[0]; i <= end[0]; i++) {
          const placement = [i, start[1]];
          entityPlacementCoordinates.push(placement);
          setCellStatus(placement, { status: STATUSES.OCCUPIED, id: entityID });
        }
      } else {
        for (let i = start[1]; i <= end[1]; i++) {
          const placement = [start[0], i];
          entityPlacementCoordinates.push(placement);
          setCellStatus(placement, { status: STATUSES.OCCUPIED, id: entityID });
        }
      }
    } else return false;
    placedEntityCoordinates.set(entityID, entityPlacementCoordinates);
    return true;
  };

  return {
    getPlacedEntityMap: () => placedEntityCoordinates,
    placeEntity,
    removePlacedEntity,
    isEntityPlaced,
    reset: () => placedEntityCoordinates.clear()
  };
};
