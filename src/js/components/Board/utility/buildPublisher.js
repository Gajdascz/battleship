import { PLACEMENT_EVENTS } from '../../../utility/constants/events';
import { Publisher } from '../../../utility/events/Publisher';

export const PUBLISHER_KEYS = {
  ACTIONS: {
    PLACEMENTS_FINALIZED: 'placementsFinalized'
  }
};

export const buildPublisher = (scope) =>
  Publisher(scope, {
    predefinedRequests: [],
    predefinedActions: [
      {
        name: PUBLISHER_KEYS.ACTIONS.PLACEMENTS_FINALIZED,
        event: PLACEMENT_EVENTS.GRID_PLACEMENTS_FINALIZED
      }
    ],
    predefinedKeys: PUBLISHER_KEYS
  });
