import { STATUSES } from '../../common/constants';
import { convertToDisplayFormat } from '../../../../Utility/utils/coordinatesUtils';

export const AiCombatManager = ({ model, view, letterAxis }) => {
  const id = model.properties.id;
  const name = model.properties.getName();
  const isAllShipsSunk = () => model.fleet.isAllShipsSunk();
  const getAttackCoordinates = () => model.moves.getRandomMove();
  const processIncomingAttack = (coordinates) => model.mainGrid.processIncomingAttack(coordinates);

  const send = {
    attack: () => {},
    result: () => {},
    shipSunk: () => {},
    lost: () => {},
    endTurn: () => {}
  };
  const incomingAttack = {
    handleShipSunk: (shipId) => {
      view.fleet.setShipSunk(shipId);
      send.shipSunk(shipId);
      if (isAllShipsSunk()) send.lost({ id, name });
    },
    processResultFromGrid: (cell) => {
      const ship = model.fleet.getShip(cell.id);
      ship.hit();
      if (ship.isSunk()) incomingAttack.handleShipSunk(ship.id);
    },
    handleRequest: ({ data }) => {
      const result = processIncomingAttack(data);
      const { coordinates, cell } = result;
      if (cell.status === STATUSES.HIT) incomingAttack.processResultFromGrid(cell);
      send.result({ coordinates, result: cell.status });
    }
  };
  const outgoingAttack = {
    sendRequest: () => {
      const attackCoordinates = getAttackCoordinates();
      send.attack(attackCoordinates);
    },
    handleIncomingResultRequest: ({ data }) => {
      const { coordinates, result } = data;
      const [row, col] = coordinates;
      const displayCoordinates = convertToDisplayFormat(row, col, letterAxis);
      view.trackingGrid.displayResult(displayCoordinates, result);
      send.endTurn();
    },
    handleIncomingSunkenShipData: ({ data }) => {
      console.log(data);
    }
  };

  const getHandlers = () => ({
    incomingAttackHandler: incomingAttack.handleRequest,
    incomingResultHandler: outgoingAttack.handleIncomingResultRequest,
    incomingSunkenShipDataHandler: outgoingAttack.handleIncomingSunkenShipData
  });
  const initializeCombat = (initData) => {
    const { sendAttack, sendResult, sendShipSunk, sendLost, endTurnMethod } = initData;
    send.attack = sendAttack;
    send.result = sendResult;
    send.shipSunk = sendShipSunk;
    send.lost = sendLost;
    send.endTurn = endTurnMethod;
    model.moves.initialize();
  };

  const startTurn = () => outgoingAttack.sendRequest();

  return { initializeCombat, startTurn, getHandlers };
};
