export const AIFleetModel = () => {
  const aiFleet = new Map();
  const opponentFleetTracker = new Map();
  const lastShipSunk = { id: null, length: null };

  return {
    isAllShipsSunk: () => [...aiFleet.values()].every((ship) => ship.isSunk()),
    isAllShipsPlaced: () => [...aiFleet.values()].every((ship) => ship.isPlaced()),
    addMainShip: (shipModel) => aiFleet.set(shipModel.id, shipModel),
    addTrackingShip: (shipID, shipLength) => opponentFleetTracker.set(shipID, shipLength),
    getShipFromAIFleet: (shipID) => aiFleet.get(shipID),
    getAIFleetData: () =>
      [...aiFleet.values()].map((shipModel) => ({
        id: shipModel.id,
        length: shipModel.length
      })),
    opponentShipSunk: (sunkShipID) => {
      const sunkShipLength = opponentFleetTracker.get(sunkShipID);
      if (sunkShipLength) {
        lastShipSunk.id = sunkShipID;
        lastShipSunk.length = sunkShipLength;
      }
      opponentFleetTracker.delete(sunkShipID);
    },
    getLastSunkLength: () => lastShipSunk.length,
    getSmallestAliveOpponentShipLength: () =>
      [...opponentFleetTracker.values()].reduce(
        (acc, value) => (value < acc ? value : acc),
        Number.MAX_SAFE_INTEGER
      ),
    getTotalFleetLength: () =>
      [...aiFleet.values()]
        .map((shipModel) => shipModel.length)
        .reduce((acc, value) => acc + value, 0),
    getLiveOpponentShipLengths: () => [...opponentFleetTracker.values()],
    getNumberOfOpponentShipsLeft: () => opponentFleetTracker.size,
    reset: () => {
      aiFleet.clear();
      opponentFleetTracker.clear();
      lastShipSunk.id = null;
      lastShipSunk.length = null;
    }
  };
};
