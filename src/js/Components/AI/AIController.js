// import addBaseAILogic from './ai/base/BaseAICore';
// import addIntermediateLogic from './ai/intermediate/IntermediateAICore';
// import addAdvancedLogic from './ai/advanced/AdvancedAICore';
import { AIModel } from './model/AIModel';
import { AIMainGridModel } from './components/MainGrid/AIMainGridModel';
import { AITrackingGridModel } from './components/TrackingGrid/AITrackingGridModel';
import { AIFleetModel } from './components/Fleet/AIFleetModel';
import { AIShipModel } from './components/Ship/AIShipModel';
import { AI_NAMES, STATUSES } from './common/constants';

import { AIView } from './AIView';
import { EventEmitter } from '../../Events/core/EventEmitter';
import { AI_COMBAT_EVENTS, AI_PLACEMENT_EVENTS } from './common/aiEvents';
import { PlacementManager } from './features/placement/PlacementManager';
import { CombatManager } from './features/combat/CombatManager';
import { BoardController } from '../Board/BoardController';

export const AIController = ({ difficulty, boardSettings, shipData }) => {
  const mainGridModel = AIMainGridModel(boardSettings.numberOfRows, boardSettings.numberOfCols);
  const trackingGridModel = AITrackingGridModel(
    boardSettings.numberOfRows,
    boardSettings.numberOfCols
  );
  const fleetModel = AIFleetModel();
  const shipNames = [];
  shipData.forEach((ship) => {
    const shipModel = AIShipModel(ship.length, ship.name);
    fleetModel.addMainShip(shipModel);
    fleetModel.addTrackingShip(shipModel.getID(), ship.length);
    shipNames.push(shipModel.getName());
  });
  const model = AIModel({
    aiName: AI_NAMES[difficulty],
    difficulty,
    fleetModel,
    mainGridModel,
    trackingGridModel
  });
  const view = AIView(boardSettings, model.properties.getName(), shipNames);

  const getAttackStrategy = () => model.moves.getRandomMove;

  const sendAttack = getAttackStrategy();

  const getId = () => model.properties.getId();
  const getName = () => model.properties.getName();
  const getTrackingGrid = () => view.trackingGrid.elements.getGrid();
  const getTrackingFleet = () => view.fleet.getTrackingFleet();

  let gameCoordinator = null;

  const placement = {
    manager: null,
    initialize: () => {
      placement.manager = PlacementManager({
        mainGrid: model.mainGrid.get(),
        placeOnGrid: model.mainGrid.place,
        fleetData: model.fleet.getData(),
        isAllShipsPlaced: model.fleet.isAllShipsPlaced,
        placementCoordinator: gameCoordinator.placement
      });
    },
    startTurn: () => placement.manager.startTurn(),
    endTurn: () => placement.manager.endTurn(),
    isOver: () => placement.manager.isOver()
  };

  const board = {
    getId: () => getId(),
    getPlayerName: () => getName(),
    provideTrackingGrid: () => getTrackingGrid(),
    provideTrackingFleet: () => getTrackingFleet(),
    setGameCoordinator: (coordinator) => (gameCoordinator = coordinator),
    placement: {
      initialize: placement.initialize,
      startTurn: placement.startTurn,
      endTurn: placement.endTurn,
      isOver: placement.isOver
    }
  };

  return {
    getPlayerModel: () => model.properties,
    getId,
    isAllShipsSunk: () => model.fleet.isAllShipsSunk(),
    sendAttack,
    board
  };
};
