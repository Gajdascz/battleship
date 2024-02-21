import { ListenerManager } from '../../../../utility/uiBuilderUtils/ListenerManager';
import { INSTRUCTIONS_DIALOG, INSTRUCTION_BUTTONS } from './constants';
import { buildInstructionsElements } from './buildInstructionsElements';
import { MOUSE_EVENTS } from '../../../../utility/constants/events';

const getButtons = (element) => {
  const closeButton = element.querySelector(`.${INSTRUCTIONS_DIALOG.CLOSE_BUTTON.CLASS}`);
  const placementInstructionsButton = element.querySelector(
    `.${INSTRUCTION_BUTTONS.PLACEMENT.CLASS}`
  );
  const combatInstructionsButton = element.querySelector(`.${INSTRUCTION_BUTTONS.COMBAT.CLASS}`);
  const settingsInstructionsButton = element.querySelector(
    `.${INSTRUCTION_BUTTONS.SETTINGS.CLASS}`
  );
  return {
    close: closeButton,
    placement: placementInstructionsButton,
    combat: combatInstructionsButton,
    settings: settingsInstructionsButton
  };
};

const EVENT_CONTROLLER_KEYS = {
  CLOSE: 'close',
  PLACEMENT: 'placement',
  COMBAT: 'combat',
  SETTINGS: 'settings'
};

export const initializeListenerManager = (element) => {
  const listenerManager = ListenerManager();
  const instructions = buildInstructionsElements();
  const buttons = getButtons(element);
  const contentContainer = element.querySelector(`.${INSTRUCTIONS_DIALOG.CONTENT_CONTAINER_CLASS}`);
  /**
   * Disables all listeners, closes the dialog, and removes the element.
   */
  const closeDialog = () => {
    listenerManager.disableAllListeners();
    element.close();
    element.remove();
  };

  const displayInstructions = (e) => {
    let instructionKey = null;
    if (e.target.classList.contains(INSTRUCTION_BUTTONS.PLACEMENT.CLASS))
      instructionKey = 'placement';
    else if (e.target.classList.contains(INSTRUCTION_BUTTONS.COMBAT.CLASS))
      instructionKey = 'combat';
    else if (e.target.classList.contains(INSTRUCTION_BUTTONS.SETTINGS.CLASS))
      instructionKey = 'settings';
    Object.values(buttons).forEach((button) => button.classList.remove('active'));
    buttons[instructionKey]?.classList.add('active');
    contentContainer.textContent = '';
    const instruction = instructions[instructionKey];
    if (instruction) contentContainer.append(instruction);
  };

  listenerManager.addController({
    element: buttons.close,
    event: MOUSE_EVENTS.CLICK,
    callback: closeDialog,
    key: EVENT_CONTROLLER_KEYS.CLOSE
  });

  [
    { btn: buttons.placement, key: EVENT_CONTROLLER_KEYS.PLACEMENT },
    { btn: buttons.combat, key: EVENT_CONTROLLER_KEYS.COMBAT },
    { btn: buttons.settings, key: EVENT_CONTROLLER_KEYS.SETTINGS }
  ].forEach(({ btn, key }) => {
    listenerManager.addController({
      element: btn,
      event: MOUSE_EVENTS.CLICK,
      callback: displayInstructions,
      key
    });
  });

  return listenerManager;
};
