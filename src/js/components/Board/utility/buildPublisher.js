import { PLACEMENT_EVENTS } from '../../../utility/constants/events';
import { Publisher } from '../../../utility/events/Publisher';
import { PUBLISHER_KEYS } from './constants';

export const buildPublisher = (scope) =>
  Publisher(scope, {
    predefinedRequests: [],
    predefinedActions: [
      {
        name: PUBLISHER_KEYS.ACTIONS.PLACEMENTS_FINALIZED,
        event: PLACEMENT_EVENTS.GRID_PLACEMENTS_FINALIZED
      }
    ]
  });
