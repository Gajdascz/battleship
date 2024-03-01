import { createIdentity } from '../../../../Utility/utils/createIdentity';

export const BoardModel = (boardScope, { mainGridModel, trackingGridModel, fleetModel }) => {
  const { id, scopedID, scope } = createIdentity({ scope: boardScope, name: 'board' });
  return {
    getID: () => id,
    getScopedID: () => scopedID,
    getScope: () => scope,
    getMainGridModel: () => mainGridModel,
    getTrackingGridModel: () => trackingGridModel,
    getFleetModel: () => fleetModel,
    getFleetPlacements: () => fleetModel.getFleetPlacements(),
    isAllShipsPlaced: () => fleetModel.isAllShipsPlaced(),
    isAllShipsSunk: () => fleetModel.isAllShipsSunk()
  };
};
