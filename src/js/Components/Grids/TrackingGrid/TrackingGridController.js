import { EventManager } from '../../../Events/management/EventManager';
import { GameStateManager } from '../../../State/GameStateManager';
import { TrackingGridModel } from './model/TrackingGridModel';
import { TrackingGridView } from './view/TrackingGridView';
import { convertToInternalFormat } from '../../../Utility/utils/coordinatesUtils';
import { TRACKING_GRID_EVENTS } from './utility/trackingGridEvents';
import { GAME_EVENTS } from '../../Game/utility/gameEvents';
import stateManagerRegistry from '../../../State/stateManagerRegistry';

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

  const combatManager = {
    initialize: () => {
      view.combatManager.initialize(combatManager.onAttack);
      subscriptionManager.scoped.subscribe(GAME_EVENTS.PLAYER_TURN, combatManager.enable);
      subscriptionManager.scoped.subscribe(
        GAME_EVENTS.ATTACK_PROCESSED,
        combatManager.onResultReceived
      );
    },
    onAttack: (displayCoordinates) => {
      const coordinates = {
        internal: convertToInternalFormat(displayCoordinates),
        display: displayCoordinates
      };
      subscriptionManager.scoped.subscribe(
        TRACKING_GRID_EVENTS.ATTACK_RESULT_REQUESTED,
        combatManager.onResultReceived
      );
      view.disable();
      view.combatManager.disable();
      publisher.scoped.noFulfill(TRACKING_GRID_EVENTS.ATTACK_SENT, coordinates);
    },
    onResultReceived: ({ data }) => {
      const { result } = data;
      subscriptionManager.scoped.unsubscribe(
        TRACKING_GRID_EVENTS.ATTACK_RESULT_REQUESTED,
        combatManager.onResultReceived
      );
      view.combatManager.displayResult(result);
      publisher.scoped.noFulfill(TRACKING_GRID_EVENTS.ATTACK_PROCESSED);
    },
    enable: () => {
      view.enable();
      view.combatManager.enable();
    },
    end: () => {
      subscriptionManager.scoped.unsubscribe(
        TRACKING_GRID_EVENTS.ATTACK_RESULT_REQUESTED,
        combatManager.onResultReceived
      );
    }
  };

  stateManager.setFunctions.placement({
    enterFns: placementManager.initialize,
    exitFns: placementManager.end
  });
  stateManager.setFunctions.progress({
    enterFns: combatManager.initialize,
    exitFns: placementManager.end
  });

  return {
    getModel: () => model,
    getView: () => view,
    initializeStateManagement: () => stateManagerRegistry.registerManager(stateManager)
  };
};
