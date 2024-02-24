import { Publisher } from '../../../../utility/events/Publisher';
import { MAIN_GRID_EVENTS } from './mainGridEvents';
import { SHIP_EVENTS } from '../../../Ship/utility/shipEvents';

export const PUBLISHER_KEYS = {
  REQUESTS: {
    PLACEMENT_FINALIZATION: 'placementFinalization'
  },
  ACTIONS: {
    PLACEMENT_PROCESSED: 'placementProcessed',
    PLACEMENT_CONTAINER_CREATED: 'placementContainerCreated'
  }
};

export const buildPublisher = (scope) =>
  Publisher(scope, {
    predefinedRequests: [
      {
        name: PUBLISHER_KEYS.REQUESTS.PLACEMENT_FINALIZATION,
        event: MAIN_GRID_EVENTS.PLACEMENT.FINALIZATION_REQUESTED
      }
    ],
    predefinedActions: [
      {
        name: PUBLISHER_KEYS.ACTIONS.PLACEMENT_PROCESSED,
        event: MAIN_GRID_EVENTS.PLACEMENT.PROCESSED
      },
      {
        name: PUBLISHER_KEYS.ACTIONS.PLACEMENT_CONTAINER_CREATED,
        event: SHIP_EVENTS.PLACEMENT.CONTAINER_CREATED
      }
    ]
  });
