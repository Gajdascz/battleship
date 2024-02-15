export const BoardModel = () => {
  let mainGridModel = null;
  let trackingGridModel = null;
  let fleetModel = null;
  return {
    getMainGridModel: () => mainGridModel,
    getTrackingGridModel: () => trackingGridModel,
    getFleetModel: () => fleetModel,
    setMainGridModel: (model) => (mainGridModel = model),
    setTrackingGridModel: (model) => (trackingGridModel = model),
    setFleetModel: (model) => (fleetModel = model)
  };
};
