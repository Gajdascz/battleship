import { SHIP_EVENTS, MAIN_GRID_EVENTS } from '../../../../Events/events';

export const FleetPlacementManager = ({ shipControllers, publisher, subscriptionManager }) => {
  const placementTracker = { containersReceived: 0 };

  const onSelectRequest = ({ data }) => {
    const { scopedID } = data;
    shipControllers.forEach((controller) => {
      if (controller.properties.getScopedID() === scopedID) controller.placement.select();
      else if (controller.properties.isSelected()) controller.placement.deselect();
    });
  };
  const onContainerReceived = () => {
    placementTracker.containersReceived += 1;
    if (placementTracker.containersReceived === shipControllers.size) {
      publisher.scoped.fulfill(MAIN_GRID_EVENTS.PLACEMENT.GRID_INITIALIZED);
    }
  };

  const subscriptions = [
    {
      event: SHIP_EVENTS.PLACEMENT.CONTAINER_RECEIVED,
      callback: onContainerReceived
    },
    {
      event: SHIP_EVENTS.SELECTION.SELECTION_REQUESTED,
      callback: onSelectRequest
    }
  ];

  const onInitialize = () => {
    subscriptionManager.scoped.subscribeMany(subscriptions);
  };
  const onEnd = () => {
    subscriptionManager.scoped.unsubscribeMany(subscriptions);
  };

  return {
    initialize: () => onInitialize(),
    end: () => onEnd()
  };
};
