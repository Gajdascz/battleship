import { GAME_MODES } from '../../../../Utility/constants/common';

export const BoardCombatManager = ({ gameMode, combatManagers, endTurn }) => {
  const { trackingGrid, fleet, mainGrid } = combatManagers;
  const incomingAttackHandler = (coordinates) => mainGrid.processIncomingAttack(coordinates);
  const incomingResultHandler = (result) => trackingGrid.acceptResult(result);

  const postAttackStrategy = {
    [GAME_MODES.HvA]: () => {
      trackingGrid.disable();
    },
    [GAME_MODES.HvH]: () => {
      trackingGrid.disable();
    }
  };

  const initializeCombat = (initData) => {
    const { id, name, sendAttack, sendResult, sendLost } = initData;
    const postAttack = postAttackStrategy[gameMode];
    const onAttack = (coordinates) => {
      console.log(coordinates);
      postAttack();
      sendAttack(coordinates);
    };
    const processIncomingAttackResult = ({ data }) => {
      console.log(data);
      sendResult(data);
    };
    const onLost = () => sendLost({ id, name });
    fleet.onAllShipsSunk(onLost);
    fleet.onShipSunk();
    trackingGrid.onSendAttack(onAttack);
    mainGrid.onIncomingAttackProcessed(processIncomingAttackResult);
  };

  return {
    initializeCombat,
    incomingAttackHandler,
    incomingResultHandler
  };
};
