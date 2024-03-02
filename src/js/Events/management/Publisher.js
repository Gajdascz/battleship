import { globalEmitter } from '../core/globalEventEmitter';
import { createEventKeyGenerator } from '../../Utility/utils/createEventKeyGenerator';

/**
 * Intermediary object used to simplify scoping and managing component's publishing events to the global globalEmitter.
 * @param {string} scope The event-scope of the publisher.
 * @param {Object} param1 Contains the predefined requests and actions of the publisher.
 * @returns {Object} Publisher object containing methods for simple event publishing.
 */
export const Publisher = (scope) => {
  const { getKey } = createEventKeyGenerator(scope);
  const publish = ({ event, data, requireFulfillment }) => {
    if (!event) throw new Error(`Invalid Event: ${event}`);
    globalEmitter.publish(event, data, requireFulfillment);
  };
  const publishFulfill = (event) => globalEmitter.publishFulfill(event);

  return {
    noFulfillGlobal: (event, data) => publish({ event, data, requireFulfillment: false }),
    requireFulfillGlobal: (event, data) => publish({ event, data, requireFulfillment: true }),
    noFulfillScoped: (event, data) =>
      publish({ event: getKey(event), data, requireFulfillment: false }),
    requireFulfillScoped: (event, data) =>
      publish({ event: getKey(event), data, requireFulfillment: true }),
    fulfillScoped: (event) => publishFulfill(getKey(event)),
    fulfillGlobal: (event) => publishFulfill(event)
  };
};
