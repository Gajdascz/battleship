import { MainGridModel } from './main/model/MainGridModel';
import { MainGridView } from './main/view/MainGridView';
import { MainGridCombatManager } from './features/combat/MainGridCombatManager';
import { MAIN_GRID_COMBAT_EVENTS, MAIN_GRID_PLACEMENT_EVENTS } from './common/mainGridEvents';
import { EventEmitter } from '../../../Events/core/EventEmitter';
import { MainGridPlacementManager } from './features/placement/MainGridPlacementManager';

export const MainGridController = (scope, boardConfig) => {
  const { numberOfRows, numberOfCols, letterAxis } = boardConfig;
  const model = MainGridModel(scope, { numberOfRows, numberOfCols, letterAxis });
  const view = MainGridView({ numberOfRows, numberOfCols, letterAxis });
  const emitter = EventEmitter();
  const { publish } = emitter;
  const placementManager = MainGridPlacementManager({ model, view, emitter });
  MainGridCombatManager(model, view, emitter);

  return {
    placementManager,
    combat: {
      initialize: () => publish(MAIN_GRID_COMBAT_EVENTS.INITIALIZE),
      processIncomingAttack: (coordinates) =>
        publish(MAIN_GRID_COMBAT_EVENTS.PROCESS_INCOMING_ATTACK, coordinates),
      onIncomingAttackProcessed: (callback) =>
        publish(MAIN_GRID_COMBAT_EVENTS.SUB_INCOMING_ATTACK_PROCESSED, callback),
      offIncomingAttackProcessed: (callback) =>
        publish(MAIN_GRID_COMBAT_EVENTS.UNSUB_INCOMING_ATTACK_PROCESSED, callback),
      end: () => publish(MAIN_GRID_COMBAT_EVENTS.END)
    },
    properties: {
      getDimensions: () => model.getDimensions()
    },
    view: {
      attachTo: (container) => view.attachTo(container),
      attachWithinWrapper: (element) => view.attachWithinWrapper(element),
      getGrid: () => view.elements.getGrid(),
      getWrapper: () => view.elements.getWrapper(),
      getSubmitButton: () => view.elements.getSubmitPlacementsButton(),
      hide: () => view.hide(),
      show: () => view.show(),
      enable: () => view.enable(),
      disable: () => view.disable()
    }
  };
};
