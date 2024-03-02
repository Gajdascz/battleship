import { STATUSES } from '../../../../../Utility/constants/common';

export const EntityPlacementManager = ({ mainGrid, valueAt, setCellStatus, isInBounds }) => {
  const placedEntityCoordinates = new Map();
  const isEntityPlaced = (id) => placedEntityCoordinates.has(id);

  const isPlacementValid = (start, end) => {
    if (!isInBounds(start) || !isInBounds(end)) return false;
    for (let row = start[0]; row <= end[0]; ++row) {
      for (let col = start[1]; col <= end[1]; ++col) {
        if (!mainGrid[row][col].status === STATUSES.EMPTY) return false;
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
    if (isPlacementValid(start, end)) {
      for (let row = start[0]; row <= end[0]; ++row) {
        for (let col = start[1]; col <= end[1]; ++col) {
          const placement = [row, col];
          entityPlacementCoordinates.push(placement);
          mainGrid[row][col] = { status: STATUSES.OCCUPIED, id: entityID };
        }
      }
      placedEntityCoordinates.set(entityID, entityPlacementCoordinates);
      return true;
    } else {
      return false;
    }
  };

  return {
    getPlacedEntityMap: () => placedEntityCoordinates,
    placeEntity,
    removePlacedEntity,
    isEntityPlaced,
    reset: () => placedEntityCoordinates.clear()
  };
};
