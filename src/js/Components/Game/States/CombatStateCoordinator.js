import { COMMON_ELEMENTS } from '../../../Utility/constants/dom/elements';
import { BASE_CLASSES } from '../../../Utility/constants/dom/baseStyles';
import { buildUIElement } from '../../../Utility/uiBuilderUtils/uiBuilders';
import { MOUSE_EVENTS } from '../../../Utility/constants/dom/domEvents';
import { CombatManager } from '../Managers/CombatManager';
import { GAME_MODES } from '../../../Utility/constants/common';
const EndTurnButtonManager = ({ sendEndTurn, enableOn, disableOn, eventMethods }) => {
  const { on, off } = eventMethods;
  const element = buildUIElement(COMMON_ELEMENTS.BUTTON, {
    text: 'End Turn',
    attributes: { class: `${BASE_CLASSES.BUTTON} end-turn-button`, disabled: '' }
  });
  const enable = () => {
    element.disabled = false;
    element.addEventListener(MOUSE_EVENTS.CLICK, sendEndTurn);
  };
  const disable = () => {
    element.disabled = true;
    element.removeEventListener(MOUSE_EVENTS.CLICK, sendEndTurn);
  };
  on(enableOn, enable);
  on(disableOn, disable);
  return {
    element,
    reset: () => {
      off(enableOn, enable);
      off(disableOn, disable);
      disable();
      element.remove();
    }
  };
};
export const CombatStateCoordinator = ({
  eventMethods,
  eventGetters,
  combatControllers,
  playerIds,
  currentPlayerId,
  endTurnMethods,
  onTurnStartManagers,
  overEvent,
  gameMode
}) => {
  let combatManager = null;
  const { getScoped, getBaseTypes } = eventGetters;
  let endTurnButtons = {};

  const getPlayerCombatEvents = (id) => getScoped(id, getBaseTypes().COMBAT);
  const getPlayerCombatHandlers = (id) => combatControllers[id].getHandlers();
  const getPlayerCombatData = (id) => ({
    id,
    handlers: getPlayerCombatHandlers(id),
    combatEvents: getPlayerCombatEvents(id)
  });
  const loadManager = () => {
    if (combatManager) return;
    const [p1Id, p2Id] = playerIds;
    combatManager = CombatManager({
      p1CombatData: getPlayerCombatData(p1Id),
      p2CombatData: getPlayerCombatData(p2Id),
      eventMethods,
      overEvent
    });
  };

  const start = () => {
    const controllersArray = Object.entries(combatControllers);
    const initCombatControllers = () => {
      controllersArray.forEach(([key, controller]) => {
        controller.init();
        onTurnStartManagers[key].set(controller.startTurn);
      });
    };
    const provideMethodsToControllers = () => {
      if (!combatManager) loadManager();
      controllersArray.forEach(([key, controller]) => {
        controller.start({ endTurnMethod: endTurnMethod(key), ...combatManager[key] });
      });
    };
    let endTurnMethod = (id) => endTurnMethods[id];
    if (gameMode === GAME_MODES.HvH) {
      playerIds.forEach(
        (id) =>
          (endTurnButtons[id] = EndTurnButtonManager({
            sendEndTurn: endTurnMethods[id],
            enableOn: getPlayerCombatEvents(id).SEND_ATTACK,
            disableOn: getScoped(id, getBaseTypes().TURN).START_TURN,
            eventMethods
          }))
      );
      endTurnMethod = (id) => endTurnButtons[id].element;
    }
    initCombatControllers();
    provideMethodsToControllers(endTurnMethod);
    combatControllers[currentPlayerId].startTurn();
  };
  const reset = () => {
    combatManager.reset();
    combatManager = null;

    Object.values(combatControllers).forEach((controller) => controller.end());

    const endTurnButtonsArray = Object.values(endTurnButtons);
    if (endTurnButtonsArray.length > 0) endTurnButtonsArray.forEach((btn) => btn.reset());
    endTurnButtons = {};
  };
  return { start, reset };
};
