export const BoardModel = ({ mainGridModel, trackingGridModel, fleetModel }) => ({
  getMainGridModel: () => mainGridModel,
  getTrackingGridModel: () => trackingGridModel,
  getFleetModel: () => fleetModel,
  getFleetPlacements: () => fleetModel.getFleetPlacements(),
  isAllShipsPlaced: () => fleetModel.isAllShipsPlaced(),
  isAllShipsSunk: () => fleetModel.isAllShipsSunk()
});
