import { createIdentity } from '../../../../Utility/utils/createIdentity';

export const BoardModel = (boardScope, { mainGridModel, trackingGridModel, fleetModel }) => {
  const { id, scopedID, scope } = createIdentity({ scope: boardScope, name: 'board' });
  let opponentScope = null;
  return {
    getID: () => id,
    getScopedID: () => scopedID,
    getScope: () => scope,
    getMainGridModel: () => mainGridModel,
    getTrackingGridModel: () => trackingGridModel,
    getFleetModel: () => fleetModel,
    getFleetPlacements: () => fleetModel.getFleetPlacements(),
    setOpponentScope: (scope) => (opponentScope = scope),
    getOpponentScope: () => opponentScope,
    isAllShipsPlaced: () => fleetModel.isAllShipsPlaced(),
    isAllShipsSunk: () => fleetModel.isAllShipsSunk()
  };
};
