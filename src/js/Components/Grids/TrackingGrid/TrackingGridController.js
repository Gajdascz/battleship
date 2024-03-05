// Tracking Grid Component
import { TrackingGridModel } from './main/model/TrackingGridModel';
import { TrackingGridView } from './main/view/TrackingGridView';
import { TrackingGridCombatManager } from './features/combat/TrackingGridCombatManager';

// External
import { EventEmitter } from '../../../Events/core/EventEmitter';
import { GameStateManager } from '../../../State/GameStateManager';
import stateManagerRegistry from '../../../State/stateManagerRegistry';
import { TRACKING_GRID_COMBAT_EVENTS } from './common/trackingGridEvents';

export const TrackingGridController = (scope, { numberOfRows, numberOfCols, letterAxis }) => {
  const model = TrackingGridModel(scope, { numberOfRows, numberOfCols, letterAxis });
  const view = TrackingGridView({ numberOfRows, numberOfCols, letterAxis });
  const stateManager = GameStateManager(model.getScopedID());
  const componentEmitter = EventEmitter();
  const { publish } = componentEmitter;
  return {
    initializeStateManagement: () => stateManagerRegistry.registerManager(stateManager),
    combat: {
      initialize: () => {
        TrackingGridCombatManager(view, componentEmitter);
        publish(TRACKING_GRID_COMBAT_EVENTS.INITIALIZE);
      },
      processAttackResult: (result) =>
        publish(TRACKING_GRID_COMBAT_EVENTS.PROCESS_ATTACK_RESULT, result),
      onAttackSent: (callback) => publish(TRACKING_GRID_COMBAT_EVENTS.SUB_ATTACK_SENT, callback),
      offAttackSent: (callback) => publish(TRACKING_GRID_COMBAT_EVENTS.UNSUB_ATTACK_SENT, callback),
      onAttackProcessed: (callback) =>
        publish(TRACKING_GRID_COMBAT_EVENTS.SUB_ATTACK_PROCESSED, callback),
      offAttackProcessed: (callback) =>
        publish(TRACKING_GRID_COMBAT_EVENTS.UNSUB_ATTACK_PROCESSED, callback),
      end: () => publish(TRACKING_GRID_COMBAT_EVENTS.END)
    },
    view: {
      attachTo: (container) => view.attachTo(container),
      attachWithinWrapper: (element) => view.attachWithinWrapper(element),
      getGrid: () => view.elements.getGrid(),
      getWrapper: () => view.elements.getWrapper(),
      hide: () => view.hide(),
      show: () => view.show(),
      enable: () => view.enable(),
      disable: () => view.disable()
    }
  };
};
