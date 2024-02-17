import { PLACEMENT_EVENTS } from '../../../../utility/constants/events';
import { Publisher } from '../../../../utility/events/Publisher';
import { PUBLISHER_KEYS } from './constants';

export const buildPublisher = (scope) =>
  Publisher(scope, {
    predefinedActions: [
      {
        name: PUBLISHER_KEYS.ACTIONS.PLACEMENT_PROCESSED,
        event: PLACEMENT_EVENTS.GRID_PLACEMENT_PROCESSED
      }
    ]
  });
