import { PLACEMENT_EVENTS } from '../../../../utility/constants/events';
import { Publisher } from '../../../../utility/events/Publisher';

export const PUBLISHER_KEYS = {
  REQUESTS: {
    PLACEMENT_FINALIZATION: 'placementFinalization'
  },
  ACTIONS: {
    PLACEMENT_PROCESSED: 'placementProcessed'
  }
};

export const buildPublisher = (scope) =>
  Publisher(scope, {
    predefinedRequests: [
      {
        name: PUBLISHER_KEYS.REQUESTS.PLACEMENT_FINALIZATION,
        event: PLACEMENT_EVENTS.GRID_PLACEMENTS_FINALIZATION_REQUESTED
      }
    ],
    predefinedActions: [
      {
        name: PUBLISHER_KEYS.ACTIONS.PLACEMENT_PROCESSED,
        event: PLACEMENT_EVENTS.GRID_PLACEMENT_PROCESSED
      }
    ]
  });
