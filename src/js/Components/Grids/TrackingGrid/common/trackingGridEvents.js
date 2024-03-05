export const TRACKING_GRID_COMBAT_EVENTS = {
  // Requests
  INITIALIZE: 'combatInitializeRequested',
  SEND_ATTACK: 'sendAttackRequested',
  PROCESS_ATTACK_RESULT: 'attackResultProcessRequested',
  END: 'combatEndRequested',

  // Subscription Requests
  SUB_ATTACK_SENT: 'attackSentSubscribe',
  UNSUB_ATTACK_SENT: 'attackSentUnsubscribe',
  SUB_ATTACK_PROCESSED: 'attackProcessedSubscribe',
  UNSUB_ATTACK_PROCESSED: 'attackProcessedUnsubscribe',

  // Declarations
  ATTACK_SENT: 'attackSent',
  ATTACK_PROCESSED: 'attackProcessedInTracking'
};
