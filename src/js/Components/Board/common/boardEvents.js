export const BOARD_PLACEMENT_EVENTS = {
  START: 'placementStartRequested',
  END: 'placementEndRequested'
};

export const BOARD_COMBAT_EVENTS = {
  START: 'boardCombatStartRequested',
  ATTACK_SENT: 'boardSendingAttackRequest',
  SENT_ATTACK_PROCESSED: 'boardSentAttackResultReceived',
  INCOMING_ATTACK: 'boardReceivedIncomingAttackRequest',
  INCOMING_ATTACK_PROCESSED: 'boardIncomingAttackProcessed',
  TURN_ENDED: 'playerEndedTurn',
  END: 'boardCombatEndRequested'
};
