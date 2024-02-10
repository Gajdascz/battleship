// eslint-disable-next-line arrow-body-style
export const FleetView = (fleetElements, trackingFleetElements) => {
  return {
    getFleetElements: () => fleetElements,
    getTrackingFleetElements: () => trackingFleetElements
  };
};
