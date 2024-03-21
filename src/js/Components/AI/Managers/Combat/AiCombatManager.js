import { STATUSES } from '../../../../Utility/constants/common';
import { convertToDisplayFormat } from '../../../../Utility/utils/coordinatesUtils';
import { IntermediateMoveStrategy } from './Strategies/IntermediateMoveStrategy';
import AdvancedMoveStrategy from './Strategies/AdvancedMoveStrategy';
export const AiCombatManager = ({ model, view, letterAxis, attackDelay }) => {
  const id = model.properties.id;
  const isAllShipsSunk = () => model.fleet.isAllShipsSunk();
  const processIncomingAttack = (coordinates) => model.mainGrid.processIncomingAttack(coordinates);

  const popRandomMove = model.moves.popRandomMove;
  const popMove = model.moves.popMove;
  const trackingGrid = model.trackingGrid.get();
  const setTrackingGridCellStatus = model.trackingGrid.setCellStatus;

  const baseProcessResult = (coordinates, result) => {
    setTrackingGridCellStatus(coordinates, result);
    const [row, col] = coordinates;
    const displayCoordinates = convertToDisplayFormat(row, col, letterAxis);
    view.trackingGrid.displayResult(displayCoordinates, result);
  };

  const getAttackStrategy = (difficulty) => {
    switch (+difficulty) {
      case 0:
        return {
          getNextMove: popRandomMove,
          processResult: ({ data }) => {
            baseProcessResult(data.coordinates, data.result);
            send.endTurn();
          }
        };
      case 1: {
        const { getNextMove, processMoveResult } = IntermediateMoveStrategy({
          trackingGrid,
          popMove,
          popRandomMove
        });
        return {
          getNextMove,
          processResult: ({ data }) => {
            const { coordinates, result } = data;
            baseProcessResult(coordinates, result);
            processMoveResult(coordinates, result);
            send.endTurn();
          }
        };
      }
      case 2: {
        const { getNextMove, processMoveResult } = AdvancedMoveStrategy({
          trackingGrid,
          popRandomMove,
          fleetData: model.fleet.getData()
        });
        return {
          getNextMove,
          processResult: ({ data }) => {
            const { coordinates, result } = data;
            baseProcessResult(coordinates, result);
            processMoveResult(data);
            send.endTurn();
          }
        };
      }
    }
  };

  const send = {
    attack: () => {},
    result: () => {},
    lost: () => {},
    endTurn: () => {},
    reset: () => {
      send.attack = () => {};
      send.result = () => {};
      send.lost = () => {};
      send.endTurn = () => {};
    }
  };
  const incomingAttack = {
    handleShipSunk: (shipId) => {
      view.fleet.setShipSunk(shipId);
      if (isAllShipsSunk()) send.lost({ id });
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
    getNextMove: () => {},
    processIncomingResult: () => {},
    send: (move) => () => setTimeout(() => send.attack(move), attackDelay),
    init: (strategy) => {
      outgoingAttack.getNextMove = strategy.getNextMove;
      outgoingAttack.processIncomingResult = strategy.processResult;
      if (strategy.onShipSunk) outgoingAttack.onShipSunk = strategy.onShipSunk;
    },
    sendRequest: () => {
      if (isAllShipsSunk()) return;
      const move = outgoingAttack.getNextMove();
      setTimeout(() => send.attack(move), attackDelay);
    },
    handleIncomingResultRequest: (data) => outgoingAttack.processIncomingResult(data)
  };

  const getHandlers = () => ({
    incomingAttackHandler: incomingAttack.handleRequest,
    incomingResultHandler: outgoingAttack.handleIncomingResultRequest
  });
  const initializeCombat = (initData) => {
    const { sendAttack, sendResult, sendLost, endTurnMethod } = initData;
    send.attack = sendAttack;
    send.result = sendResult;
    send.lost = sendLost;
    send.endTurn = endTurnMethod;
    model.moves.initialize();
    outgoingAttack.init(getAttackStrategy(model.properties.getDifficulty()));
  };

  const startTurn = () => outgoingAttack.sendRequest();
  const reset = () => {
    send.reset();
    model.moves.reset();
  };

  return { initializeCombat, startTurn, getHandlers, reset };
};
