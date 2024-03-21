import { vi } from 'vitest';
import { areCoordinatePairs } from '../Utility/utils/validationUtils';
const DIRECTIONS = {
  UP: [-1, 0],
  RIGHT: [0, 1],
  DOWN: [1, 0],
  LEFT: [0, -1]
};

const ORIENTATION = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal'
};

const areCoordinatesEqual = vi.fn((c1, c2) => c1[0] === c2[0] && c1[1] === c2[1]);

const getAbsoluteDeltaVector = vi.fn((coordinatesOne, coordinatesTwo) => {
  const deltaVector = getDelta(coordinatesOne, coordinatesTwo, true);
  return [Math.abs(deltaVector[0]), Math.abs(deltaVector[1])];
});

const isDiagonal = vi.fn((coordinatesOne, coordinatesTwo) => {
  const vector = getAbsoluteDeltaVector(coordinatesOne, coordinatesTwo);
  return vector[0] === 1 && vector[1] === 1;
});

const isHorizontal = vi.fn(
  (coordinatesOne, coordinatesTwo) =>
    !isDiagonal(coordinatesOne, coordinatesTwo) && coordinatesOne[0] === coordinatesTwo[0]
);

const isVertical = vi.fn(
  (coordinatesOne, coordinatesTwo) =>
    !isDiagonal(coordinatesOne, coordinatesTwo) && coordinatesOne[1] === coordinatesTwo[1]
);

const sumCoordinates = vi.fn((coordinatesOne, coordinatesTwo) => {
  if (!areCoordinatePairs([coordinatesOne, coordinatesTwo])) return undefined;
  const dx = coordinatesOne[0] + coordinatesTwo[0];
  const dy = coordinatesOne[1] + coordinatesTwo[1];
  const result = [dx, dy];
  return result;
});

const getOrientationDirections = vi.fn((orientation) => {
  if (orientation === ORIENTATION.VERTICAL) return { up: DIRECTIONS.UP, down: DIRECTIONS.DOWN };
  else return { left: DIRECTIONS.LEFT, right: DIRECTIONS.RIGHT };
});

const getDelta = vi.fn((prev, next, forceSingleStep = false) => {
  if (!areCoordinatePairs([prev, next])) return undefined;
  const toSingleStepVector = (coordinate) =>
    coordinate === 0 ? 0 : coordinate / Math.abs(coordinate);
  const dx = next[0] - prev[0];
  const dy = next[1] - prev[1];
  return forceSingleStep ? [toSingleStepVector(dx), toSingleStepVector(dy)] : [dx, dy];
});

const getPerpendicularCoordinates = vi.fn((origin, orientation) => {
  if (!areCoordinatePairs([coordinatesOne, coordinatesTwo])) return undefined;
  if (orientation === ORIENTATION.VERTICAL) {
    const { left, right } = getOrientationDirections(ORIENTATION.HORIZONTAL);
    return [sumCoordinates(origin, left), sumCoordinates(origin, right)];
  } else if (orientation === ORIENTATION.HORIZONTAL) {
    const { up, down } = getOrientationDirections(ORIENTATION.VERTICAL);
    return [sumCoordinates(origin, up), sumCoordinates(origin, down)];
  }
});

const isAdjacent = vi.fn((coordinatesOne, coordinatesTwo) => {
  if (!areCoordinatePairs([coordinatesOne, coordinatesTwo])) return undefined;
  const dx = Math.abs(coordinatesOne[0] - coordinatesTwo[0]);
  const dy = Math.abs(coordinatesOne[1] - coordinatesTwo[1]);
  return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
});

const getRelativeOrientation = vi.fn((coordinatesOne, coordinatesTwo) => {
  if (!areCoordinatePairs([coordinatesOne, coordinatesTwo])) return undefined;
  return coordinatesOne[0] === coordinatesTwo[0] ? ORIENTATION.HORIZONTAL : ORIENTATION.VERTICAL;
});

const doCoordinatesMatchOrientation = vi.fn((orientation, coordinatesOne, coordinatesTwo) => {
  if (!areCoordinatePairs([coordinatesOne, coordinatesTwo])) return undefined;
  return orientation === ORIENTATION.VERTICAL
    ? coordinatesOne[1] === coordinatesTwo[1]
    : coordinatesOne[0] === coordinatesTwo[0];
});
export {
  sumCoordinates,
  areCoordinatesEqual,
  getOrientationDirections,
  getDelta,
  getPerpendicularCoordinates,
  isAdjacent,
  isHorizontal,
  isVertical,
  isDiagonal,
  getRelativeOrientation,
  doCoordinatesMatchOrientation,
  ORIENTATION,
  DIRECTIONS
};
