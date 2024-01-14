const isHTMLElement = (element) => element instanceof HTMLElement;
const throwError = (variable, type, received) => {
  throw new Error(
    `Invalid ${variable}. Expected: ${type}  Received: ${typeof received === 'object' ? typeof received : received}`
  );
};

export { isHTMLElement, throwError };
