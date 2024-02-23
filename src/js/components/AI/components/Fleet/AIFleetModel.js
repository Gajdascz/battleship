export const AIFleetModel = () => {
  const aiFleet = new Map();
  const opponentFleetTracker = new Map();
  const lastShipSunk = { id: null, length: null };

  return {
    isAllShipsSunk: () => [...aiFleet.values()].every((ship) => ship.isSunk()),
    addMainShip: (shipModel) => aiFleet.set(shipModel.getID(), shipModel),
    addTrackingShip: (shipID, shipLength) => opponentFleetTracker.set(shipID, shipLength),
    getShipFromAIFleet: (shipID) => aiFleet.get(shipID),
    getAIFleetData: () =>
      [...aiFleet.values()].map((shipModel) => ({
        id: shipModel.getID(),
        length: shipModel.getLength()
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
        .map((shipModel) => shipModel.getLength())
        .reduce((acc, value) => acc + value, 0),
    getLiveOpponentShipLengths: () => [...opponentFleetTracker.values()],
    getNumberOfOpponentShipsLeft: () => opponentFleetTracker.size
  };
};
