import { MAIN_GRID_EVENTS } from '../../../../../Events/events';
export const MainGridCombatManager = ({ model, publisher, subscriptionManager }) => {
  const acceptAttackRequest = ({ data }) => {
    const { coordinates } = data;
    const result = model.processIncomingAttack(coordinates);
    publisher.scoped.noFulfill(MAIN_GRID_EVENTS.COMBAT.INCOMING_ATTACK_PROCESSED, { result });
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
