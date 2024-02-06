import { vi } from 'vitest';

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

export const sumCoordinates = vi.fn((coordinatesOne, coordinatesTwo) => {
  const dx = coordinatesOne[0] + coordinatesTwo[0];
  const dy = coordinatesOne[1] + coordinatesTwo[1];
  const result = [dx, dy];
  return result;
});

export const getOrientationDirections = vi.fn((orientation) => {
  if (orientation === ORIENTATION.VERTICAL) return { up: DIRECTIONS.UP, down: DIRECTIONS.DOWN };
  else return { left: DIRECTIONS.LEFT, right: DIRECTIONS.RIGHT };
});

export const getDelta = vi.fn((prev, next, forceSingleStep = false) => {
  const toSingleStepVector = (coordinate) =>
    coordinate === 0 ? 0 : coordinate / Math.abs(coordinate);
  const dx = next[0] - prev[0];
  const dy = next[1] - prev[1];
  return forceSingleStep ? [toSingleStepVector(dx), toSingleStepVector(dy)] : [dx, dy];
});

export const getPerpendicularCoordinates = vi.fn((origin, orientation) => {
  if (orientation === ORIENTATION.VERTICAL) {
    const { left, right } = getOrientationDirections(ORIENTATION.HORIZONTAL);
    return [sumCoordinates(origin, left), sumCoordinates(origin, right)];
  } else if (orientation === ORIENTATION.HORIZONTAL) {
    const { up, down } = getOrientationDirections(ORIENTATION.VERTICAL);
    return [sumCoordinates(origin, up), sumCoordinates(origin, down)];
  }
});

export const isAdjacent = vi.fn((coordinatesOne, coordinatesTwo) => {
  const dx = Math.abs(coordinatesOne[0] - coordinatesTwo[0]);
  const dy = Math.abs(coordinatesOne[1] - coordinatesTwo[1]);
  return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
});

export const getRelativeOrientation = vi.fn((coordinatesOne, coordinatesTwo) =>
  coordinatesOne[0] === coordinatesTwo[0] ? ORIENTATION.HORIZONTAL : ORIENTATION.VERTICAL
);

export const doCoordinatesMatchOrientation = vi.fn((orientation, coordinatesOne, coordinatesTwo) =>
  orientation === ORIENTATION.VERTICAL
    ? coordinatesOne[1] === coordinatesTwo[1]
    : coordinatesOne[0] === coordinatesTwo[0]
);
