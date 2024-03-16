export const ElementManager = () => {
  const elements = new Map();

  const enableListeners = (elementData) => {
    const { element, listeners } = elementData;
    listeners.forEach((listener) => element.addEventListener(listener.event, listener.callback));
  };
  const disableListeners = (elementData) => {
    const { element, listeners } = elementData;
    listeners.forEach((listener) => element.removeEventListener(listener.event, listener.callback));
  };

  const add = ({ id, elementData, initListeners = false }) => {
    elements.set(id, elementData);
    if (initListeners) enableListeners(elementData);
  };
  const remove = (id) => {
    const elementData = elements.get(id);
    if (!elementData) return;
    disableListeners(elementData);
    elementData.element.remove();
    elements.delete(id);
  };

  const reset = () => elements.forEach((_, key) => remove(key));

  return {
    enableListeners,
    disableListeners,
    add,
    remove,
    reset
  };
};
