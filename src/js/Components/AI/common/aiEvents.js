export const AI_PLACEMENT_EVENTS = {
  // Requests
  PLACE_SHIPS: 'aiPlacementInitializeRequested',

  // Declarations
  SHIPS_PLACED: 'aiShipsPlaced'
};

export const AI_COMBAT_EVENTS = {
  // Requests
  INITIALIZE: 'aiCombatInitializeRequested',
  SEND_ATTACK: 'sendAttackRequested',
  PROCESS_SENT_ATTACK_RESULT: 'sentAttackResultReceived',
  INCOMING_ATTACK: 'incomingAttackReceived',
  // Subscription Requests
  SUB_ATTACK_SENT: 'attackSentSubscribe',
  UNSUB_ATTACK_SENT: 'attackSentUnsubscribe',
  SUB_INCOMING_ATTACK_PROCESSED: 'incomingAttackProcessedSubscribe',
  UNSUB_INCOMING_ATTACK_PROCESSED: 'incomingAttackProcessedUnsubscribe',
  SUB_SENT_ATTACK_PROCESSED: 'sentAttackProcessedSubscribe',
  UNSUB_SENT_ATTACK_PROCESSED: 'sentAttackProcessedUnsubscribe',
  // Declarations
  ATTACK_SENT: 'attackSent',
  INCOMING_ATTACK_PROCESSED: 'incomingAttackProcessed',
  SENT_ATTACK_PROCESSED: 'sentAttackProcessed',
  END: 'aiCombatEndRequested'
};
