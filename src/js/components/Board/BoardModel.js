export const BoardModel = ({ mainGridModel, trackingGridModel, fleetModel }) => ({
  getMainGridModel: () => mainGridModel,
  getTrackingGridModel: () => trackingGridModel,
  getFleetModel: () => fleetModel,
  isAllShipsPlaced: () => fleetModel.isAllShipsPlaced()
});
