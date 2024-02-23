import { EMITTER, PLACEMENT_EVENTS } from '../../../utility/constants/events';
import { Publisher } from '../../../utility/events/Publisher';

export const PUBLISHER_KEYS = {
  ACTIONS: {
    PLACEMENT_CONTAINER_FULFILLED: 'shipsConnectedToContainer'
  }
};

export const buildPublisher = (scope) =>
  Publisher(scope, {
    predefinedRequests: [],
    predefinedActions: [
      {
        name: PUBLISHER_KEYS.ACTIONS.PLACEMENT_CONTAINER_FULFILLED,
        event: EMITTER.FULFILLED_HANDLE(PLACEMENT_EVENTS.SHIP_PLACEMENT_CONTAINER_CREATED)
      }
    ]
  });
