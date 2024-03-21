export const AIFleetModel = () => {
  const aiFleet = new Map();

  return {
    isAllShipsSunk: () => [...aiFleet.values()].every((ship) => ship.isSunk()),
    isAllShipsPlaced: () => [...aiFleet.values()].every((ship) => ship.isPlaced()),
    addMainShip: (shipModel) => aiFleet.set(shipModel.id, shipModel),
    getShipFromAIFleet: (shipID) => aiFleet.get(shipID),
    getAIFleetData: () =>
      [...aiFleet.values()].map((shipModel) => ({
        id: shipModel.id,
        length: shipModel.length
      })),
    getTotalFleetLength: () =>
      [...aiFleet.values()]
        .map((shipModel) => shipModel.length)
        .reduce((acc, value) => acc + value, 0),
    setShipPlacementCoordinates: (id, placement) => {
      const ship = aiFleet.get(id);
      ship.setPlacedCoordinates(placement);
    },
    reset: () => aiFleet.clear()
  };
};
