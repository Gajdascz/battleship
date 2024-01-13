const isHTMLElement = (element) => element instanceof HTMLElement;
const throwError = (variable, type, received) => {
  throw new Error(`Invalid ${variable} ${type} ${typeof received === 'object' ? typeof received : received} received`);
};
export { isHTMLElement, throwError };
