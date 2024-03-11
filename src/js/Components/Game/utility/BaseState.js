export const BASE_METHODS = {
  INITIALIZE: 'initialize',
  START_TURN: 'startTurn',
  END_TURN: 'endTurn'
};

const isFn = (fn) => typeof fn === 'function';
const validateFn = (fn, at) => {
  if (!isFn(fn)) throw new Error(`Invalid Function Received At: ${at} `);
};
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

const Base = () => {
  const NOT_IMPLEMENTED = 'notImplemented';
  const defaultFn = () => NOT_IMPLEMENTED;
  const base = {
    [BASE_METHODS.INITIALIZE]: defaultFn,
    [BASE_METHODS.START_TURN]: defaultFn,
    [BASE_METHODS.END_TURN]: defaultFn
  };
  const isImplemented = (methodName) => base[methodName] !== defaultFn;
  const validateMethod = (methodName, shouldBeImplemented) => {
    if (!base[methodName]) throw new Error(`${methodName} is not a base method.`);
    if (isImplemented(methodName) !== shouldBeImplemented) {
      console.log(methodName, isImplemented(methodName), shouldBeImplemented);
      if (shouldBeImplemented) throw new Error(`${methodName} should be implemented.`);
      else if (!shouldBeImplemented) throw new Error(`${methodName} should not be implemented.`);
    }
  };
  const implement = (methodName, callback) => {
    validateMethod(methodName, false);
    validateFn(callback, `${methodName} - ${implement.name}`);
    base[methodName] = callback;
  };
  const extend = (methodName, { pre, post }) => {
    validateMethod(methodName, true);
    const original = base[methodName];
    const extendedMethod = extendFunction(original, pre, post);
    base[methodName] = extendedMethod;
  };
  const reset = () => Object.keys(base).forEach((key) => (base[key] = defaultFn));
  const getMethod = (methodName) => {
    validateMethod(methodName, true);
    return base[methodName];
  };
  return {
    getMethod,
    implement,
    extend,
    reset,
    isBaseMethod: (methodName) => {
      if (base[methodName]) return true;
      return false;
    }
  };
};
const Registry = () => {
  const registry = {};
  const isInRegistry = (methodName) => {
    if (registry[methodName]) return true;
    return false;
  };
  const add = (methodName, callback) => {
    if (isInRegistry(methodName)) throw new Error(`${methodName} already added. Extend instead.`);
    validateFn(callback, `${methodName} - ${add.name}`);
    registry[methodName] = callback;
  };
  const extend = (methodName, { pre, post }) => {
    if (!isInRegistry(methodName)) throw new Error(`${methodName} not found. Add instead.`);
    const original = registry[methodName];
    registry[methodName] = extendFunction(original, pre, post);
  };
  const update = (methodName, callback) => {
    if (!isInRegistry(methodName)) throw new Error(`${methodName} not in registry.`);
    validateFn(callback, `${methodName} - ${update.name}`);
    registry[methodName] = callback;
  };
  const getMethod = (methodName) => {
    if (!isInRegistry(methodName)) return;
    return registry[methodName];
  };
  const reset = () => Object.keys(registry).forEach((key) => delete registry[key]);

  return {
    add,
    extend,
    update,
    getMethod,
    reset
  };
};

export const BaseState = () => {
  const base = Base();
  const registry = Registry();

  const call = (methodName, ...args) => {
    const method = registry.getMethod(methodName);
    validateFn(method, `${methodName} - ${call.name}`);
    return method(...args);
  };

  const implementBase = (methodName, callback) => {
    base.implement(methodName, callback);
    registry.add(methodName, base.getMethod(methodName));
  };
  const extend = (methodName, { pre, post }) => {
    if (base.isBaseMethod(methodName)) {
      base.extend(methodName, { pre, post });
      registry.update(methodName, base.getMethod(methodName));
    } else registry.extend(methodName, { pre, post });
  };

  const add = (methodName, callback) => {
    if (base.isBaseMethod(methodName))
      throw new Error(`${methodName} is a base method. Implement or extend instead`);
    registry.add(methodName, callback);
  };

  const reset = () => {
    base.reset();
    registry.reset();
  };

  return { implementBase, call, extend, add, reset, BASE_METHODS };
};
