import { PLACEMENT_EVENTS, PROGRESS_EVENTS } from '../../../utility/constants/events';
import { Publisher } from '../../../utility/events/Publisher';

export const PUBLISHER_KEYS = {
  REQUESTS: {
    SELECTION: 'selection',
    PLACEMENT: 'placement'
  },
  ACTIONS: {
    SELECTED: 'shipSelected',
    DESELECTED: 'shipDeselected',
    ORIENTATION_TOGGLED: 'orientationToggled',
    PLACEMENT_SET: 'shipPlacementSet',
    HIT: 'shipHit'
  }
};

export const buildPublisher = (scope) =>
  Publisher(scope, {
    predefinedRequests: [
      { name: PUBLISHER_KEYS.REQUESTS.SELECTION, event: PLACEMENT_EVENTS.SHIP_SELECTION_REQUESTED },
      { name: PUBLISHER_KEYS.REQUESTS.PLACEMENT, event: PLACEMENT_EVENTS.SHIP_PLACEMENT_REQUESTED }
    ],
    predefinedActions: [
      { name: PUBLISHER_KEYS.ACTIONS.SELECTED, event: PLACEMENT_EVENTS.SHIP_SELECTED },
      { name: PUBLISHER_KEYS.ACTIONS.DESELECTED, event: PLACEMENT_EVENTS.SHIP_DESELECTED },
      {
        name: PUBLISHER_KEYS.ACTIONS.ORIENTATION_TOGGLED,
        event: PLACEMENT_EVENTS.SHIP_ORIENTATION_TOGGLED
      },
      { name: PUBLISHER_KEYS.ACTIONS.PLACEMENT_SET, event: PLACEMENT_EVENTS.SHIP_PLACEMENT_SET },
      { name: PUBLISHER_KEYS.ACTIONS.HIT, event: PROGRESS_EVENTS.SHIP_HIT }
    ]
  });
