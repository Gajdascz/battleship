import { publish } from '../utility/publishers';
import { STATUSES } from '../../../utility/constants/common';
export const HitShip = ({ hitFn, updateSunkStatusView, getID }) => {
  const _hit = hitFn;
  const _getID = getID;
  const _updateSunkStatusView = updateSunkStatusView;
  return {
    execute: () => {
      const result = _hit();
      if (result === STATUSES.SHIP_SUNK) {
        _updateSunkStatusView(true);
        publish.shipSunk(_getID());
      }
    }
  };
};
