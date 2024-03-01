import { TRACKING_GRID_EVENTS, MAIN_GRID_EVENTS, GAME_EVENTS } from '../../../../Events/events';
import { GAME_MODES } from '../../../../Utility/constants/common';
export const BoardCombatManager = ({ view, publisher, subscriptionManager }) => {
  const emit = {
    requestEnableAttack: () =>
      publisher.scoped.noFulfill(TRACKING_GRID_EVENTS.ATTACK.ENABLE_REQUESTED),
    requestDisableAttack: () =>
      publisher.scoped.noFulfill(TRACKING_GRID_EVENTS.ATTACK.DISABLE_REQUESTED),
    requestMainGridProcessAttack: (coordinates) =>
      publisher.scoped.noFulfill(MAIN_GRID_EVENTS.COMBAT.INCOMING_ATTACK_REQUESTED, {
        coordinates
      }),
    requestTrackingGridProcessResult: (result) =>
      publisher.scoped.noFulfill(TRACKING_GRID_EVENTS.ATTACK.RESULT_RECEIVED, { result }),
    attackProcessed: () => publisher.scoped.noFulfill(GAME_EVENTS.ATTACK_PROCESSED)
  };

  const onStartTurn = () => {
    view.display();
    emit.requestEnableAttack();
    subscriptionManager.scoped.subscribe(TRACKING_GRID_EVENTS.ATTACK.SENT, onAttackSent);
  };
  const onAttackSent = ({ data }) => {
    const { internal, display } = data;
    subscriptionManager.scoped.unsubscribe(TRACKING_GRID_EVENTS.ATTACK.SENT, onAttackSent);
    emit.requestDisableAttack();
    subscriptionManager.scoped.subscribe(
      MAIN_GRID_EVENTS.COMBAT.INCOMING_ATTACK_PROCESSED,
      onMainGridProcessedAttack
    );
    emit.requestMainGridProcessAttack(internal);
  };

  const onMainGridProcessedAttack = ({ data }) => {
    const { cellData } = data;
    subscriptionManager.scoped.unsubscribe(
      MAIN_GRID_EVENTS.COMBAT.INCOMING_ATTACK_PROCESSED,
      onMainGridProcessedAttack
    );
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
    emit.attackProcessed();
  };

  const subscriptions = [{ event: GAME_EVENTS.PLAYER_TURN, callback: onStartTurn }];

  const onInitialize = (gameMode) => {
    if (gameMode === GAME_MODES.HvH) {
      view.buttons.endTurn.init();
      const enableEndTurn = () => {
        view.buttons.endTurn.enable();
      };
      subscriptions.push({
        event: TRACKING_GRID_EVENTS.ATTACK.DISABLE_REQUESTED,
        callback: enableEndTurn
      });
    }
    subscriptionManager.scoped.subscribeMany(subscriptions);
  };

  const onEnd = () => {
    subscriptionManager.scoped.unsubscribeMany(subscriptions);
  };

  return {
    initialize: (gameMode) => onInitialize(gameMode),
    end: () => onEnd()
  };
};
