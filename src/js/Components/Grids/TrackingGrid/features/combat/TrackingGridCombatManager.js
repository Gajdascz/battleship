// Tracking Grid Component
import { TRACKING_GRID_COMBAT_EVENTS } from '../../common/trackingGridEvents';
import { TrackingGridCombatView } from './TrackingGridCombatView';
import { ManagerFactory } from '../../../../../Utility/ManagerFactory';
import { convertToInternalFormat } from '../../../../../Utility/utils/coordinatesUtils';
const TrackingGridCombatManager = ({ view, createHandler }) => {
  const combatView = TrackingGridCombatView(view);

  const outgoingAttack = {
    handler: null,
    send: (displayCoordinates) => {
      const coordinates = convertToInternalFormat(displayCoordinates);
      console.log(coordinates);
      outgoingAttack.handler.emit(coordinates);
    },
    acceptResult: ({ data }) => {
      const { result } = data;
      combatView.displayResult(result);
    },
    enable: () => combatView.enable(),
    disable: () => combatView.disable(),
    on: (callback) => outgoingAttack.handler.on(callback),
    off: (callback) => outgoingAttack.handler.off(callback),
    initialize: () =>
      (outgoingAttack.handler = createHandler(TRACKING_GRID_COMBAT_EVENTS.ATTACK_SENT)),
    end: () => outgoingAttack.handler.reset()
  };

  const initialize = () => {
    outgoingAttack.initialize();
    combatView.initialize(outgoingAttack.send);
  };
  const end = () => {
    outgoingAttack.end();
    combatView.end();
  };

  return {
    initialize,
    end,
    enable: outgoingAttack.enable,
    disable: outgoingAttack.disable,
    acceptResult: outgoingAttack.acceptResult,
    onSendAttack: outgoingAttack.on,
    offSendAttack: outgoingAttack.off
  };
};

export const CombatManagerFactory = ({ view, createHandler }) =>
  ManagerFactory({
    ManagerBuilder: TrackingGridCombatManager,
    initialDetails: { view, createHandler },
    validateDetails: (details) => details.view && details.createHandler
  });
