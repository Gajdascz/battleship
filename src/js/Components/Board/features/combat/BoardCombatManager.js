import { STATUSES } from '../../../../Utility/constants/common';

export const BoardCombatManager = ({ playerId, combatManagers, combatView }) => {
  const { trackingGrid, fleet, mainGrid } = combatManagers;

  const send = {
    attack: () => {},
    result: () => {},
    lost: () => {},
    endTurn: () => {},
    reset: () => {
      send.attack = () => {};
      send.result = () => {};
      send.endTurn = () => {};
    }
  };
  const incomingAttack = {
    isInitialized: false,
    onLost: null,
    lastSunk: null,
    allShipsSunk: false,
    handleRequest: (coordinates) => mainGrid.processIncomingAttack(coordinates),
    updateLastSunk: ({ data }) => (incomingAttack.lastSunk = data),
    triggerAllShipsSunk: () => (incomingAttack.allShipsSunk = true),
    process: ({ data }) => {
      const { coordinates, cellValue } = data;
      const { status, id } = cellValue;
      let payload = { result: status };
      if (status === STATUSES.HIT) {
        fleet.hit(id);
        if (incomingAttack.lastSunk) {
          if (incomingAttack.lastSunk === id) payload = { result: STATUSES.SHIP_SUNK, id };
          else incomingAttack.lastSunk = null;
        }
      }
      send.result({ coordinates, ...payload });
      if (incomingAttack.allShipsSunk) send.lost({ id: playerId });
    },
    init: () => {
      if (incomingAttack.isInitialized) return;
      mainGrid.onIncomingAttackProcessed(incomingAttack.process);
      fleet.onAllShipsSunk(incomingAttack.triggerAllShipsSunk);
      incomingAttack.isInitialized = true;
    }
  };
  const outgoingAttack = {
    isInitialized: false,
    sendRequest: (coordinates) => {
      trackingGrid.disable();
      send.attack(coordinates);
    },
    handleIncomingResultRequest: (result) => trackingGrid.acceptResult(result),
    init: () => {
      if (outgoingAttack.isInitialized) return;
      trackingGrid.onSendAttack(outgoingAttack.sendRequest);
      outgoingAttack.isInitialized = true;
    }
  };

  const initializeCombat = (initData) => {
    const { sendAttack, sendResult, sendLost, endTurnMethod } = initData;
    send.attack = sendAttack;
    send.result = sendResult;
    send.lost = sendLost;
    fleet.start();
    mainGrid.start();
    trackingGrid.start();
    outgoingAttack.init();
    incomingAttack.init();
    if (typeof endTurnMethod === 'function') trackingGrid.onResultProcessed(endTurnMethod);
    else combatView.setEndTurnButton(endTurnMethod);
  };

  const startTurn = () => {
    combatView.startTurn();
    trackingGrid.enable();
  };

  const reset = () => {
    mainGrid.end();
    trackingGrid.end();
    fleet.end();
    send.reset();
    incomingAttack.onLost = null;
    incomingAttack.isInitialized = false;
    outgoingAttack.isInitialized = false;
    incomingAttack.lastSunk = null;
    incomingAttack.allShipsSunk = false;
    combatView.reset();
  };

  return {
    initializeCombat,
    startTurn,
    incomingAttackHandler: incomingAttack.handleRequest,
    incomingResultHandler: outgoingAttack.handleIncomingResultRequest,
    reset
  };
};
