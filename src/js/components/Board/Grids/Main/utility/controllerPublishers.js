import eventEmitter from '../../../../utility/eventEmitter';

export const handle = {
  shipSelected: (shipElement, id, orientation) => {
    eventEmitter.publish(, {
      element: shipElement,
      length,
      id,
      orientation
    });
  },
  orientationToggled: (id, orientation) => {
    eventEmitter.publish(SHIP.EVENTS.ORIENTATION_CHANGED, { id, orientation });
  },
  placementSuccessful: () => eventEmitter.publish('shipPlacementSuccessful'),
  shipHit: (id) => eventEmitter.publish('shipHit', { id }),
  shipSunk: (id) => eventEmitter.publish('shipSunk', { id })
};
