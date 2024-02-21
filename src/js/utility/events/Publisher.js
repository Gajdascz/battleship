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
  const publish = (key, data) => {
    console.log(key, data);
    eventEmitter.publish(key, data);
  };

  if (predefinedRequests.length > 0) initializePredefined(predefinedRequests, addRequest);
  if (predefinedActions.length > 0) initializePredefined(predefinedActions, addAction);

  return {
    addRequest,
    addAction,
    request: (name, data) => {
      publish(requests[name], data);
    },
    execute: (name, data) => publish(actions[name], data),
    publishGlobal: (event, data) => publish(event, data),
    reset: () => {
      Object.keys(requests).forEach((key) => delete requests[key]);
      Object.keys(actions).forEach((key) => delete actions[key]);
    }
  };
};
