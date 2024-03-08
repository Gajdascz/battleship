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
      outgoingAttack.handler.emit(coordinates);
    },
    acceptResult: (result) => combatView.displayResult(result),
    enable: () => combatView.enable(),
    disable: () => combatView.disable(),
    on: (callback) => outgoingAttack.handler.on(callback),
    off: (callback) => outgoingAttack.handler.off(callback),
    start: () => (outgoingAttack.handler = createHandler(TRACKING_GRID_COMBAT_EVENTS.ATTACK_SENT)),
    end: () => outgoingAttack.handler.reset()
  };

  const start = () => {
    outgoingAttack.start();
    combatView.initialize(outgoingAttack.send);
  };
  const end = () => {
    outgoingAttack.end();
    combatView.end();
  };

  return {
    start,
    end,
    enable: () => outgoingAttack.enable(),
    disable: () => outgoingAttack.disable(),
    acceptResult: (result) => outgoingAttack.acceptResult(result),
    onSendAttack: (callback) => outgoingAttack.on(callback),
    offSendAttack: (callback) => outgoingAttack.off(callback)
  };
};

export const CombatManagerFactory = ({ view, createHandler }) =>
  ManagerFactory({
    ManagerBuilder: TrackingGridCombatManager,
    initialDetails: { view, createHandler },
    validateDetails: (details) => details.view && details.createHandler
  });
