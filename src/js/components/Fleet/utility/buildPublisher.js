import { PLACEMENT_EVENTS } from '../../../utility/constants/events';
import { Publisher } from '../../../utility/events/Publisher';

export const PUBLISHER_KEYS = {
  ACTIONS: {
    ALL_SHIPS_READY_FOR_PLACEMENT: 'allShipsReadyForPlacement'
  }
};

export const buildPublisher = (scope) =>
  Publisher(scope, {
    predefinedRequests: [],
    predefinedActions: [
      {
        name: PUBLISHER_KEYS.ACTIONS.ALL_SHIPS_READY_FOR_PLACEMENT,
        event: PLACEMENT_EVENTS.FLEET_ALL_SHIPS_READY_FOR_PLACEMENT
      }
    ]
  });
