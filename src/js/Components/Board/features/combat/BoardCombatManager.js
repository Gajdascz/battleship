import {
  TRACKING_GRID_EVENTS,
  MAIN_GRID_EVENTS,
  GAME_EVENTS,
  SHIP_EVENTS
} from '../../../../Events/events';
import { GAME_MODES } from '../../../../Utility/constants/common';
import { STATUSES } from '../../../AI/common/constants';
export const BoardCombatManager = ({ view, publisher, subscriptionManager, scopeManager }) => {
  const emit = {
    requestDisableAttack: () =>
      publisher.scoped.noFulfill(TRACKING_GRID_EVENTS.ATTACK.DISABLE_REQUESTED),

    requestOpponentMainGridProcessAttack: (coordinates) => {
      scopeManager.publishActiveScopeEvent(MAIN_GRID_EVENTS.COMBAT.INCOMING_ATTACK_REQUESTED, {
        coordinates
      });
    },
    requestShipHit: (shipID) => {
      publisher.scoped.noFulfill(SHIP_EVENTS.COMBAT.HIT_REQUESTED, { shipID });
    },
    requestTrackingGridProcessResult: (result) =>
      publisher.scoped.noFulfill(TRACKING_GRID_EVENTS.ATTACK.RESULT_RECEIVED, { result }),
    requestEndTurn: () => publisher.scoped.noFulfill(GAME_EVENTS.PLAYER_END_TURN_REQUESTED)
  };

  const onStartTurn = () => {
    view.display();
    publisher.scoped.noFulfill(TRACKING_GRID_EVENTS.ATTACK.ENABLE_REQUESTED);
    subscriptionManager.scoped.subscribe(TRACKING_GRID_EVENTS.ATTACK.SENT, onAttackSent);
  };
  const onAttackSent = ({ data }) => {
    const {
      internal: [x, y],
      display
    } = data;
    subscriptionManager.scoped.unsubscribe(TRACKING_GRID_EVENTS.ATTACK.SENT, onAttackSent);
    emit.requestDisableAttack();
    emit.requestOpponentMainGridProcessAttack([x, y]);
  };

  const onMainGridProcessedAttack = ({ data }) => {
    const { cellData } = data;
    if (cellData.status === STATUSES.HIT) emit.requestShipHit(cellData.id);
    subscriptionManager.scoped.subscribe(
      TRACKING_GRID_EVENTS.ATTACK.PROCESSED,
      onTrackingGridProcessedResult
    );
    emit.requestTrackingGridProcessResult(cellData.status);
  };

  const onTrackingGridProcessedResult = () => {
    subscriptionManager.scoped.unsubscribe(
      TRACKING_GRID_EVENTS.ATTACK.PROCESSED,
      onTrackingGridProcessedResult
    );
  };

  const subscriptions = [{ event: GAME_EVENTS.PLAYER_TURN, callback: onStartTurn }];

  const onInitialize = (gameMode, opponentScope) => {
    scopeManager.addScopeToRegistry(opponentScope);
    scopeManager.setScopeDetails(
      opponentScope,
      MAIN_GRID_EVENTS.COMBAT.INCOMING_ATTACK_PROCESSED,
      onMainGridProcessedAttack
    );
    if (gameMode === GAME_MODES.HvH) {
      view.buttons.endTurn.init();
      view.buttons.endTurn.addListener(emit.requestEndTurn);
      const enableEndTurn = () => {
        view.buttons.endTurn.enable();
      };
      subscriptions.push({
        event: TRACKING_GRID_EVENTS.ATTACK.DISABLE_REQUESTED,
        callback: enableEndTurn
      });
    } else {
      subscriptions.push({
        event: TRACKING_GRID_EVENTS.ATTACK.PROCESSED,
        callback: emit.requestEndTurn
      });
    }
    subscriptionManager.scoped.subscribeMany(subscriptions);
  };

  const onEnd = () => {
    scopeManager.clearAllSubscriptions();
    subscriptionManager.scoped.unsubscribeMany(subscriptions);
  };

  return {
    initialize: (gameMode, opponentScope) => onInitialize(gameMode, opponentScope),
    end: () => onEnd()
  };
};
