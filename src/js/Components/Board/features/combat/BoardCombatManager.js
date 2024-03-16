import { STATUSES } from '../../../../Utility/constants/common';

export const BoardCombatManager = ({ combatManagers, combatView }) => {
  const { trackingGrid, fleet, mainGrid } = combatManagers;

  const send = {
    attack: () => {},
    result: () => {},
    shipSunk: () => {},
    lost: () => {},
    endTurn: () => {},
    reset: () => {
      send.attack = () => {};
      send.result = () => {};
      send.shipSunk = () => {};
      send.endTurn = () => {};
    }
  };
  const incomingAttack = {
    isInitialized: false,
    onLost: null,
    handleRequest: (coordinates) => mainGrid.processIncomingAttack(coordinates),
    processResultFromGrid: ({ data }) => {
      const { coordinates, cellValue } = data;
      const { status, id } = cellValue;
      if (status === STATUSES.HIT) fleet.hit(id);
      send.result({ coordinates, result: status });
    },
    init: (id, name) => {
      if (incomingAttack.isInitialized) return;
      mainGrid.onIncomingAttackProcessed(incomingAttack.processResultFromGrid);
      incomingAttack.onLost = () => send.lost({ id, name });
      fleet.onAllShipsSunk(incomingAttack.onLost);
      fleet.onShipSunk(send.shipSunk);
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
    const { id, name, sendAttack, sendResult, sendShipSunk, sendLost, endTurnMethod } = initData;
    send.attack = sendAttack;
    send.result = sendResult;
    send.shipSunk = sendShipSunk;
    send.lost = sendLost;
    fleet.start();
    mainGrid.start();
    trackingGrid.start();
    outgoingAttack.init();
    incomingAttack.init(id, name);
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
