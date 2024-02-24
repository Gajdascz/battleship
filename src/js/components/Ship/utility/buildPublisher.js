import { SHIP_EVENTS } from './shipEvents';
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
    HIT: 'shipHit',
    READY_FOR_PLACEMENT: 'shipReadyForPlacement'
  }
};

export const buildPublisher = (scope) =>
  Publisher(scope, {
    predefinedRequests: [
      { name: PUBLISHER_KEYS.REQUESTS.SELECTION, event: SHIP_EVENTS.SELECTION.REQUESTED },
      { name: PUBLISHER_KEYS.REQUESTS.PLACEMENT, event: SHIP_EVENTS.PLACEMENT.REQUESTED }
    ],
    predefinedActions: [
      { name: PUBLISHER_KEYS.ACTIONS.SELECTED, event: SHIP_EVENTS.SELECTION.SELECTED },
      { name: PUBLISHER_KEYS.ACTIONS.DESELECTED, event: SHIP_EVENTS.SELECTION.DESELECTED },
      {
        name: PUBLISHER_KEYS.ACTIONS.ORIENTATION_TOGGLED,
        event: SHIP_EVENTS.SELECTION.ORIENTATION_TOGGLED
      },
      { name: PUBLISHER_KEYS.ACTIONS.PLACEMENT_SET, event: SHIP_EVENTS.PLACEMENT.SET },
      { name: PUBLISHER_KEYS.ACTIONS.HIT, event: SHIP_EVENTS.COMBAT.SHIP_HIT },
      {
        name: PUBLISHER_KEYS.ACTIONS.READY_FOR_PLACEMENT,
        event: SHIP_EVENTS.PLACEMENT.READY
      }
    ]
  });
