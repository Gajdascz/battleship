import { STATUSES } from '../../common/constants';
import { convertToDisplayFormat } from '../../../../Utility/utils/coordinatesUtils';

export const CombatManager = ({ model, view, letterAxis, combatCoordinator, resetController }) => {
  const getAttackStrategy = () => model.moves.getRandomMove;
  const getAttackCoordinates = getAttackStrategy();
  model.moves.initialize();

  const { call, extend, BASE_METHODS, reset } = combatCoordinator;
  const { trackingGrid: trackingGridView } = view;
  const callInitialize = (args) => call(BASE_METHODS.INITIALIZE, args);
  const callStartTurn = () => call(BASE_METHODS.START_TURN);
  const callEndTurn = () => call(BASE_METHODS.END_TURN);

  const callSendAttack = (coordinates) => call(BASE_METHODS.SEND_ATTACK, coordinates);
  const callSendResult = (result) => call(BASE_METHODS.SEND_RESULT, result);

  const displaySentAttackResult = (row, col, result) => {
    const displayCoordinates = convertToDisplayFormat(row, col, letterAxis);
    console.log(result);
    trackingGridView.displayResult(displayCoordinates, result);
  };

  const handleShipHit = (coordinates, cell) => {
    const ship = model.fleet.getShip(cell.id);
    ship.hit();
    const isSunk = ship.isSunk();
    if (isSunk) view.fleet.setShipSunk(ship.id);
    callSendResult({ coordinates, result: cell.status, isSunk });
  };

  const incomingAttackHandler = ({ data }) => {
    const result = model.mainGrid.processIncomingAttack(data);
    const { coordinates, cell } = result;
    if (result.cell.status === STATUSES.HIT) handleShipHit(coordinates, cell);
    else callSendResult({ coordinates, result: cell.status });
  };
  const sentAttackResultHandler = ({ data }) => {
    const { coordinates, result, isSunk, sunkShip } = data;
    const [row, col] = coordinates;
    displaySentAttackResult(row, col, result);
  };

  extend(BASE_METHODS.START_TURN, {
    post: () => {
      sendAttack();
    }
  });

  const sendAttack = () => {
    const attackCoordinates = getAttackCoordinates();
    callSendAttack(attackCoordinates);
    callEndTurn();
  };
  const destruct = () => {
    resetController();
    reset();
  };

  callInitialize({ incomingAttackHandler, sentAttackResultHandler });

  return {
    startTurn: () => callStartTurn(),
    endTurn: () => callEndTurn(),
    isOver: () => model.fleet.isAllShipsSunk(),
    destruct,
    isAI: () => {}
  };
};
