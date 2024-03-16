// Tracking Grid Component
import { TRACKING_GRID_COMBAT_EVENTS } from '../../common/trackingGridEvents';
import { TrackingGridCombatView } from './TrackingGridCombatView';
import { ManagerFactory } from '../../../../../Utility/ManagerFactory';
import { convertToInternalFormat } from '../../../../../Utility/utils/coordinatesUtils';
const TrackingGridCombatManager = ({ view, createHandler }) => {
  const combatView = TrackingGridCombatView(view);

  const acceptResult = {
    handler: null,
    process: ({ data }) => {
      const { result } = data;
      combatView.displayResult(result);
      acceptResult.handler.emit();
    },
    on: (callback) => acceptResult.handler.on(callback),
    off: (callback) => acceptResult.handler.off(callback),
    initialize: () =>
      (acceptResult.handler = createHandler(TRACKING_GRID_COMBAT_EVENTS.RESUlT_PROCESSED)),
    end: () => outgoingAttack.handler.reset()
  };

  const outgoingAttack = {
    handler: null,
    send: (displayCoordinates) => {
      const coordinates = convertToInternalFormat(displayCoordinates);
      outgoingAttack.handler.emit(coordinates);
    },
    enable: () => combatView.enable(),
    disable: () => combatView.disable(),
    on: (callback) => outgoingAttack.handler.on(callback),
    off: (callback) => outgoingAttack.handler.off(callback),
    initialize: () =>
      (outgoingAttack.handler = createHandler(TRACKING_GRID_COMBAT_EVENTS.ATTACK_SENT)),
    end: () => outgoingAttack.handler.reset()
  };

  const start = () => {
    outgoingAttack.initialize();
    acceptResult.initialize();
    combatView.initialize(outgoingAttack.send);
  };
  const end = () => {
    outgoingAttack.end();
    combatView.end();
    acceptResult.end();
  };

  return {
    start,
    end,
    enable: outgoingAttack.enable,
    disable: outgoingAttack.disable,
    acceptResult: acceptResult.process,
    onResultProcessed: acceptResult.on,
    offResultProcessed: acceptResult.off,
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
