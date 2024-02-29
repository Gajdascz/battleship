const calculateQuadrant = (x, y, gridWidth, gridHeight) => {
  const midPointX = Math.floor(gridWidth / 2);
  const midPointY = Math.floor(gridHeight / 2);

  if (x < midPointX && y < midPointY) return 'Q1';
  else if (x >= midPointX && y < midPointY) return 'Q2';
  else if (x < midPointX && y >= midPointY) return 'Q3';
  else return 'Q4';
};

export const mapShipQuadrants = (placementsMap, gridWidth, gridHeight) => {
  const quadrantMap = new Map([
    ['Q1', []],
    ['Q2', []],
    ['Q3', []],
    ['Q4', []]
  ]);

  placementsMap.forEach((storedCoordinates, shipID) => {
    storedCoordinates.forEach((coordinatePair) => {
      const quadrantKey = calculateQuadrant(
        coordinatePair[0],
        coordinatePair[1],
        gridWidth,
        gridHeight
      );
      const shipsInQuadrant = quadrantMap.get(quadrantKey);
      if (!shipsInQuadrant.includes(shipID)) shipsInQuadrant.push(shipID);
    });
  });

  return quadrantMap;
};
