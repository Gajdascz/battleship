export const BASE_METHODS = {
  INITIALIZE: 'initialize',
  START_TURN: 'startTurn',
  END_TURN: 'endTurn',
  IS_OVER: 'isOver'
};
const isFn = (fn) => typeof fn === 'function';

/**
 * Conditionally wraps the original function with pre/post functions if they're defined.
 * @param {Function} original Original Function.
 * @param {Function} pre Function to execute pre original.
 * @param {Function} post Function to execute post original.
 * @returns {Function} Extended function.
 *
 */
const extendFunction = (original, pre, post) => {
  let extendedMethod = original;
  if (isFn(pre)) {
    extendedMethod = (
      (original) =>
      (...args) => {
        pre(...args);
        return original(...args);
      }
    )(extendedMethod);
  }
  if (isFn(post)) {
    extendedMethod = (
      (original) =>
      (...args) => {
        const result = original(...args);
        post(...args);
        return result;
      }
    )(extendedMethod);
  }
  return extendedMethod;
};

/**
 * Creates and returns a base state with default methods and utilities for extension and addition.
 * @typedef {Object} Functions A type to represent the extension functions.
 * @property {Function} [pre] Function to execute before the base method.
 * @property {Function} [post] Function to execute after the base method.
 *
 * @typedef {Object} BaseState Structure of the base state.
 * @property {Function} initialize Method for initializing the state.
 * @property {Function} startTurn Method to execute when starting turn.
 * @property {Function} endTurn Method to execute when ending turn.
 * @property {Function} isOver Method to check if state is over.
 * @property {(method: keyof BaseState, {pre, post}: Functions) => void} extend Extends existing state methods.
 * @property {(property: string, detail: Function) => void} add Adds non-existing state methods.
 */
/** @returns {BaseState} */
export const BaseState = () => {
  /** @type {BaseState} */
  const base = {
    [BASE_METHODS.INITIALIZE]: () => {},
    [BASE_METHODS.START_TURN]: () => {},
    [BASE_METHODS.END_TURN]: () => {},
    [BASE_METHODS.IS_OVER]: () => {}
  };

  const registry = {
    [BASE_METHODS.INITIALIZE]: base[BASE_METHODS.INITIALIZE],
    [BASE_METHODS.START_TURN]: base[BASE_METHODS.START_TURN],
    [BASE_METHODS.END_TURN]: base[BASE_METHODS.END_TURN],
    [BASE_METHODS.IS_OVER]: base[BASE_METHODS.IS_OVER]
  };

  const call = (methodName, ...args) => {
    if (!isFn(registry[methodName])) throw new Error(`${methodName} is not callable.`);
    return registry[methodName](...args);
  };
  /**
   * Safely extends an existing method with pre and/or post execution logic.
   * Throws an error if the method does not exist or is not a function.
   * @param {keyof BaseState} methodName The name of the method to extend.
   * @param {Functions} functions The pre and/or post functions to execute around the base method.
   */
  const extend = (methodName, { pre, post }) => {
    if (!registry[methodName]) throw new Error(`${methodName} not found. Use add instead.`);
    const original = registry[methodName];
    const extendedMethod = extendFunction(original, pre, post);
    base[methodName] = extendedMethod;
    registry[methodName] = extendedMethod;
  };
  /**
   * Adds a new property or method if it does not already exist. Throws an error otherwise.
   * @param {string} property The name of the property or method to add.
   * @param {Function} detail The implementation of the property or method.
   */
  const add = (methodName, methodFn) => {
    if (registry[methodName]) throw new Error(`${methodName} exists. Use extend instead.`);
    if (!isFn(methodFn)) throw new Error(`Method fn for ${methodName} is not a function.`);
    registry[methodName] = methodFn;
  };

  return { ...base, call, extend, add, BASE_METHODS };
};
