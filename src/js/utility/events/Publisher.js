import eventEmitter from './eventEmitter';
import { createEventKeyGenerator } from '../utils/createEventKeyGenerator';
const initializePredefined = (predefined, addFn) =>
  predefined.forEach(({ name, event }) => addFn(name, event));

export const Publisher = (scope = '', { predefinedRequests = [], predefinedActions = [] }) => {
  const { getKey } = createEventKeyGenerator(scope);
  const requests = {};
  const actions = {};

  const addRequest = (name, event) => (requests[name] = getKey(event));
  const addAction = (name, event) => (actions[name] = getKey(event));
  const publish = (key, data, requireFulfillment = false) => {
    eventEmitter.publish(key, data, requireFulfillment);
  };

  if (predefinedRequests.length > 0) initializePredefined(predefinedRequests, addRequest);
  if (predefinedActions.length > 0) initializePredefined(predefinedActions, addAction);

  return {
    addRequest,
    addAction,
    request: (name, data) => {
      publish(requests[name], data);
    },
    execute: (name, data, requireFulfillment = false) =>
      publish(actions[name], data, requireFulfillment),
    publishGlobal: (event, data) => publish(event, data),
    reset: () => {
      Object.keys(requests).forEach((key) => delete requests[key]);
      Object.keys(actions).forEach((key) => delete actions[key]);
    }
  };
};
