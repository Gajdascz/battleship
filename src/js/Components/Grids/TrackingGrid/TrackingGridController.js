// Tracking Grid Component
import { TrackingGridModel } from './main/model/TrackingGridModel';
import { TrackingGridView } from './main/view/TrackingGridView';
import { TrackingGridCombatManager } from './features/combat/TrackingGridCombatManager';

// External
import { EventManager } from '../../../Events/management/EventManager';
import { GameStateManager } from '../../../State/GameStateManager';
import stateManagerRegistry from '../../../State/stateManagerRegistry';
import { TRACKING_GRID_EVENTS } from './common/trackingGridEvents';

export const TrackingGridController = (scope, { numberOfRows, numberOfCols, letterAxis }) => {
  const model = TrackingGridModel(scope, { numberOfRows, numberOfCols, letterAxis });
  const view = TrackingGridView({ numberOfRows, numberOfCols, letterAxis });
  const stateManager = GameStateManager(model.getScopedID());
  const { componentEmitter, publisher, subscriptionManager } = EventManager(scope);

  const placementManager = {
    initialize: () => {
      view.disable();
      view.hide();
    },
    end: () => {
      view.enable();
      view.show();
    }
  };
  // const combatManager = TrackingGridCombatManager({ view, publisher, subscriptionManager });

  // stateManager.setFunctions.placement({
  //   enterFns: placementManager.initialize,
  //   exitFns: placementManager.end
  // });
  // stateManager.setFunctions.progress({
  //   enterFns: combatManager.initialize,
  //   exitFns: combatManager.end
  // });

  return {
    getModel: () => model,
    getView: () => view,
    initializeStateManagement: () => stateManagerRegistry.registerManager(stateManager),
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
