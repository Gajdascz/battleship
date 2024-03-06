export const TRACKING_GRID_COMBAT_EVENTS = {
  // Requests
  INITIALIZE: 'combatInitializeRequested',
  SEND_ATTACK: 'sendAttackRequested',
  PROCESS_SENT_ATTACK_RESULT: 'attackResultProcessRequested',
  ENABLE: 'enableAttackRequested',
  DISABLE: 'disableAttackRequested',
  END: 'combatEndRequested',

  // Subscription Requests
  SUB_ATTACK_SENT: 'attackSentSubscribe',
  UNSUB_ATTACK_SENT: 'attackSentUnsubscribe',
  SUB_SENT_ATTACK_PROCESSED: 'attackProcessedSubscribe',
  UNSUB_SENT_ATTACK_PROCESSED: 'attackProcessedUnsubscribe',

  // Declarations
  ATTACK_SENT: 'attackSent',
  SENT_ATTACK_PROCESSED: 'attackProcessedInTracking'
};
