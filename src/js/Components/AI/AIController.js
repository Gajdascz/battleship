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

const AI_EVENTS = {
  PLACEMENTS_FINISHED: 'placementsFinished'
};

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
  const view = AIView(boardSettings, model.properties.name, shipNames);

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
    initialize: () => {
      const pub = () => publish(AI_EVENTS.PLACEMENTS_FINISHED);
      const unsub = () => unsubscribe(AI_EVENTS.PLACEMENTS_FINISHED, placement.manager.endTurn);
      placement.manager = PlacementManager({
        mainGrid: model.mainGrid.get(),
        placeOnGrid: model.mainGrid.place,
        setShipPlacementCoordinates: model.fleet.setShipPlacementCoordinates,
        fleetData: model.fleet.getData(),
        isAllShipsPlaced: model.fleet.isAllShipsPlaced,
        placementCoordinator: gameCoordinator.placement,
        resetController: placement.resetController,
        unsub,
        pub
      });
      subscribe(AI_EVENTS.PLACEMENTS_FINISHED, placement.manager.endTurn);
      placement.manager.initialize();
    },
    resetController: () => (placement.manager = null),
    getManager: () => {
      if (!placement.manager) placement.initialize();
      return placement.manager;
    }
  };

  const board = {
    id,
    name,
    provideTrackingGrid: () => getTrackingGrid(),
    provideTrackingFleet: () => getTrackingFleet(),
    setGameCoordinator: (coordinator) => (gameCoordinator = coordinator),
    getPlacementManager: () => placement.getManager()
  };

  return {
    getPlayerModel: () => model.properties,
    id,
    isAllShipsSunk: () => model.fleet.isAllShipsSunk(),
    sendAttack,
    board
  };
};
