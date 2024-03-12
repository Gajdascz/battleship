import { GAME_MODES } from '../../../../Utility/constants/common';
import { STATUSES } from '../../../AI/common/constants';

export const BoardCombatManager = ({
  gameMode,
  combatControllers,
  combatCoordinator,
  processIncomingAttack,
  resetController
}) => {
  const { trackingGrid, fleet } = combatControllers;
  const { extend, call, BASE_METHODS, reset } = combatCoordinator;

  const callInitialize = (args) => call(BASE_METHODS.INITIALIZE, ...args);
  const callStartTurn = () => call(BASE_METHODS.START_TURN);
  const callEndTurn = () => call(BASE_METHODS.END_TURN);

  const callSendAttack = (coordinates) => call(BASE_METHODS.SEND_ATTACK, coordinates);
  const callSendResult = (result) => call(BASE_METHODS.SEND_RESULT, result);

  const incomingAttackHandler = (targetCoordinates) => {
    const { coordinates, value } = processIncomingAttack(targetCoordinates);
    const result = { coordinates, result: value.status, isSunk: null, sunkShip: null };
    if (value.status === STATUSES.HIT) result.isSunk = fleet.hit(value.id);
    if (result.isSunk) result.sunkShip = value.id;
    callSendResult(result);
  };
  const sentAttackResultHandler = (result) => trackingGrid.acceptResult(result);

  const setOnSendAttack = (callback) => trackingGrid.onSendAttack(callback);

  const onSendAttackStrategy = {
    [GAME_MODES.HvA]: (coordinates) => {
      trackingGrid.disable();
      callSendAttack(coordinates);
      callEndTurn();
    },
    [GAME_MODES.HvH]: (coordinates) => {}
  };

  const onSendAttack = onSendAttackStrategy[gameMode];
  extend(BASE_METHODS.INITIALIZE, {
    post: () => {
      trackingGrid.initialize();
      fleet.start();
      setOnSendAttack(onSendAttack);
    }
  });
  extend(BASE_METHODS.START_TURN, {
    post: () => trackingGrid.enable()
  });

  const destruct = () => {
    trackingGrid.end();
    fleet.end();
    reset();
    resetController();
  };
  callInitialize([{ incomingAttackHandler, sentAttackResultHandler }]);

  return {
    startTurn: () => callStartTurn(),
    endTurn: () => callEndTurn(),
    isOver: () => fleet.isAllShipsSunk(),
    destruct
  };
};
