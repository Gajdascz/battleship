import { GAME_MODES, STATUSES } from '../../../../Utility/constants/common';

export const BoardCombatManager = ({ gameMode, combatManagers, combatView }) => {
  const { trackingGrid, fleet, mainGrid } = combatManagers;
  const postAttackStrategy = {
    [GAME_MODES.HvA]: () => {
      trackingGrid.disable();
      send.endTurn();
    },
    [GAME_MODES.HvH]: () => {
      trackingGrid.disable();
      // enable button -> on button click send.endTurn()
    }
  };

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
    updateOnAttackSent: postAttackStrategy[gameMode],
    sendRequest: (coordinates) => {
      send.attack(coordinates);
      outgoingAttack.updateOnAttackSent();
    },
    handleIncomingResultRequest: (result) => {
      console.log(result);
      trackingGrid.acceptResult(result);
    },
    init: () => {
      if (outgoingAttack.isInitialized) return;
      trackingGrid.onSendAttack(outgoingAttack.sendRequest);
      outgoingAttack.isInitialized = true;
    }
  };

  const initializeCombat = (initData) => {
    const { id, name, sendAttack, sendResult, sendShipSunk, sendLost, sendEndTurn } = initData;
    send.attack = sendAttack;
    send.result = sendResult;
    send.shipSunk = sendShipSunk;
    send.lost = sendLost;
    send.endTurn = sendEndTurn;
    fleet.start();
    mainGrid.start();
    trackingGrid.start();
    outgoingAttack.init();
    incomingAttack.init(id, name);
  };

  const startTurn = () => trackingGrid.enable();

  const reset = () => {
    mainGrid.end();
    trackingGrid.end();
    fleet.end();
    send.reset();
    incomingAttack.onLost = null;
    incomingAttack.isInitialized = false;
    outgoingAttack.isInitialized = false;
  };

  return {
    initializeCombat,
    startTurn,
    incomingAttackHandler: incomingAttack.handleRequest,
    incomingResultHandler: outgoingAttack.handleIncomingResultRequest,
    reset
  };
};
