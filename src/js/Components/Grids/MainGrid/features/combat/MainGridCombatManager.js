import { MAIN_GRID_EVENTS } from '../../../../../Events/events';
import { convertToDisplayFormat } from '../../../../../Utility/utils/coordinatesUtils';
import { STATUSES } from '../../../../AI/common/constants';

export const MainGridCombatManager = ({ model, view, publisher, subscriptionManager }) => {
  const acceptAttackRequest = ({ data }) => {
    const { coordinates } = data;
    const cellData = model.processIncomingAttack(coordinates);
    const [x, y] = coordinates;
    const displayCoordinates = convertToDisplayFormat(x, y, model.getLetterAxis());
    if (cellData.status === STATUSES.HIT) view.displayShipHit(displayCoordinates);

    publisher.scoped.noFulfill(MAIN_GRID_EVENTS.COMBAT.INCOMING_ATTACK_PROCESSED, { cellData });
  };

  const subscriptions = [
    {
      event: MAIN_GRID_EVENTS.COMBAT.INCOMING_ATTACK_REQUESTED,
      callback: acceptAttackRequest
    }
  ];

  return {
    initialize: () => {
      subscriptionManager.scoped.subscribeMany(subscriptions);
    },
    end: () => {
      subscriptionManager.scoped.unsubscribeMany(subscriptions);
    }
  };
};
