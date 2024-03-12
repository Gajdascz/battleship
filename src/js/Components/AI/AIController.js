// import addBaseAILogic from './ai/base/BaseAICore';
// import addIntermediateLogic from './ai/intermediate/IntermediateAICore';
// import addAdvancedLogic from './ai/advanced/AdvancedAICore';
import { AIModel } from './model/AIModel';
import { AIMainGridModel } from './components/MainGrid/AIMainGridModel';
import { AITrackingGridModel } from './components/TrackingGrid/AITrackingGridModel';
import { AIFleetModel } from './components/Fleet/AIFleetModel';
import { AIShipModel } from './components/Ship/AIShipModel';
import { AI_NAMES } from './common/constants';

import { AIView } from './AIView';
import { EventEmitter } from '../../Events/core/EventEmitter';
import { PlacementManager } from './features/placement/PlacementManager';
import { CombatManager } from './features/combat/CombatManager';

const AI_EVENTS = {
  PLACEMENTS_FINISHED: 'placementsFinished'
};

export const AIController = ({ difficulty, boardSettings, shipData }) => {
  const mainGridModel = AIMainGridModel(boardSettings.numberOfRows, boardSettings.numberOfCols);
  const trackingGridModel = AITrackingGridModel(
    boardSettings.numberOfRows,
    boardSettings.numberOfCols
  );
  const letterAxis = boardSettings.letterAxis;
  const fleetModel = AIFleetModel();
  const shipNames = [];
  shipData.forEach((ship) => {
    const shipModel = AIShipModel(ship.length, ship.name);
    fleetModel.addMainShip(shipModel);
    fleetModel.addTrackingShip(shipModel.id, ship.length);
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

  const id = model.properties.id;
  const name = model.properties.name;
  const getTrackingGrid = () => view.trackingGrid.elements.getGrid();
  const getTrackingFleet = () => view.fleet.getTrackingFleet();

  const emitter = EventEmitter();
  const { publish, subscribe, unsubscribe } = emitter;

  let gameCoordinator = null;

  const placement = {
    manager: null,
    endTurn: null,
    initialize: () => {
      const pubPlacementsFinalized = () => publish(AI_EVENTS.PLACEMENTS_FINISHED);
      const unsubPlacementsFinalized = () =>
        unsubscribe(AI_EVENTS.PLACEMENTS_FINISHED, placement.manager.endTurn);
      placement.manager = PlacementManager({
        mainGrid: model.mainGrid.get(),
        placeOnGrid: model.mainGrid.place,
        setShipPlacementCoordinates: model.fleet.setShipPlacementCoordinates,
        fleetData: model.fleet.getData(),
        isAllShipsPlaced: model.fleet.isAllShipsPlaced,
        placementCoordinator: gameCoordinator.placement,
        resetController: placement.resetController,
        unsubPlacementsFinalized,
        pubPlacementsFinalized
      });
      placement.endTurn = placement.manager.endTurn;
      subscribe(AI_EVENTS.PLACEMENTS_FINISHED, placement.manager.endTurn);
    },
    resetController: () => (placement.manager = null),
    getManager: () => {
      if (!placement.manager) placement.initialize();
      return placement.manager;
    }
  };
  const combat = {
    manager: null,
    initialize: () => {
      combat.manager = CombatManager({
        model,
        view,
        letterAxis,
        setCellStatus: view.trackingGrid.setCellStatus,
        combatCoordinator: gameCoordinator.combat,
        resetController: combat.resetController
      });
    },
    resetController: () => (combat.manager = null),
    getManager: () => {
      if (!combat.manager) combat.initialize();
      return combat.manager;
    }
  };
  const board = {
    id,
    name,
    provideTrackingGrid: () => getTrackingGrid(),
    provideTrackingFleet: () => getTrackingFleet(),
    setGameCoordinator: (coordinator) => (gameCoordinator = coordinator),
    getPlacementManager: () => placement.getManager(),
    getCombatManager: () => combat.getManager(),
    subscribeEndTurn: (callback) => gameCoordinator.subscribeEndTurn(callback),
    unsubscribeEndTurn: (callback) => gameCoordinator.unsubscribeEndTurn(callback)
  };

  return {
    getPlayerModel: () => model.properties,
    id,
    isAllShipsSunk: () => model.fleet.isAllShipsSunk(),
    sendAttack,
    board
  };
};
