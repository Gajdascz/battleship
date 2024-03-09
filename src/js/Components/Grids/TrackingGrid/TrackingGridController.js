// Tracking Grid Component
import { TrackingGridModel } from './main/model/TrackingGridModel';
import { TrackingGridView } from './main/view/TrackingGridView';
import { CombatManagerFactory } from './features/combat/TrackingGridCombatManager';

// External
import { EventEmitter } from '../../../Events/core/EventEmitter';
import { EventHandler } from '../../../Events/management/EventHandler';

export const TrackingGridController = ({ numberOfRows, numberOfCols, letterAxis }) => {
  const model = TrackingGridModel({ numberOfRows, numberOfCols, letterAxis });
  const view = TrackingGridView({ numberOfRows, numberOfCols, letterAxis });

  const emitter = EventEmitter();
  const createHandler = (eventName, callback = (args) => args) =>
    EventHandler(emitter, eventName, callback);

  const combatManager = CombatManagerFactory({ view, createHandler });
  const getCombatManager = () => combatManager.getManager();

  return {
    getCombatManager,
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
