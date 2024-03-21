// Tracking Grid Component
import { TrackingGridModel } from './main/model/TrackingGridModel';
import { TrackingGridView } from './main/view/TrackingGridView';
import { CombatManagerFactory } from './Managers/TrackingGridCombatManager';

// External
import { EventEmitter } from '../../../Events/core/EventEmitter';
import { EventHandler } from '../../../Events/management/EventHandler';

/**
 * Initializes a TrackingGridController which acts as the primary interface for interacting with the tracking grid component.
 * The tracking grid provides outgoing attack functionality and tracking.
 *
 * @param {Object} detail Initialize detail.
 * @returns {Object} Interface for interacting with tracking grid component.
 */
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
