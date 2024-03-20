export const OpponentFleetManager = (gameFleet) => {
  const getFleetMap = (fleet) => new Map(fleet.map((ship) => [ship.id, ship.length]));
  const opponentFleetTracker = getFleetMap(gameFleet);
  const lastShipSunk = { id: null, length: null };
  return {
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
    getLiveOpponentShipLengths: () => [...opponentFleetTracker.values()],
    getNumberOfOpponentShipsLeft: () => opponentFleetTracker.size,
    areAllOpponentShipsSunk: () => opponentFleetTracker.size === 0,
    reset: () => {
      opponentFleetTracker.clear();
      lastShipSunk.id = null;
      lastShipSunk.length = null;
    }
  };
};
