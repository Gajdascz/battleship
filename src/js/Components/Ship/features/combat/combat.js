import { STATUSES } from '../../../../Utility/constants/common';
import { SHIP_EVENTS } from '../../common/shipEvents';

export const ShipCombatManager = ({ model, view, publisher }) => {
  const combatController = {
    hit: () => {
      const result = model.hit();
      if (result === STATUSES.SHIP_SUNK) {
        view.updateSunkStatus(true);
        publisher.scoped.noFulfill(SHIP_EVENTS.COMBAT.SHIP_HIT, { id: model.getScope() });
      }
    },
    handleAttack: ({ data }) => {
      combatController.hit();
    }
  };

  const enableCombatSettings = () => {};
};
