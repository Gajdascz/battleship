export const ListenerManager = () => {
  const createEventController = ({ element, event, callback, id }) => {
    let isActive = false;
    return {
      enable: () => {
        if (isActive) return;
        element.addEventListener(event, callback);
        isActive = true;
      },
      disable: () => {
        if (!isActive) return;
        element.removeEventListener(event, callback);
        isActive = false;
      },
      id
    };
  };
};

const listeners = {
  activeListeners: {},
  p2DynamicDifficulty: createListenerManager(
    p2DifficultySelect,
    'change',
    setColorCallback,
    'difficultySelect'
  ),
  rowRestriction: createListenerManager(rowsInput, 'change', enforceRowMax, 'rowMax'),
  colRestriction: createListenerManager(colsInput, 'change', enforceColMax, 'colMax'),
  preventEscape: createListenerManager(
    dialogElement,
    KEY_EVENTS.DOWN,
    preventEscape,
    'preventEscape'
  ),
  p2TypeUpdate: createListenerManager(p2TypeSelect, 'change', updateP2TypeOnChange, 'p2TypeUpdate'),
  submit: createListenerManager(submitButton, MOUSE_EVENTS.CLICK, getInputValues, 'submit'),
  cancel: createListenerManager(cancelButton, MOUSE_EVENTS.CLICK, closeOnCancel, 'cancel'),
  enableAll: () => Object.values(listeners).forEach((listener) => listener.enable()),
  disableAll: () => Object.values(listeners).forEach((listener) => listener.disable())
};
