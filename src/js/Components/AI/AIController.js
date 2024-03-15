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
import { PlacementCoordinatesGenerator } from './features/placement/PlacementCoordinatesGenerator';

import { AiCombatManager } from './features/combat/AiCombatManager';

export const AIController = ({ difficulty, boardSettings, fleetData }) => {
  const mainGridModel = AIMainGridModel(boardSettings.numberOfRows, boardSettings.numberOfCols);
  const trackingGridModel = AITrackingGridModel(
    boardSettings.numberOfRows,
    boardSettings.numberOfCols
  );
  const letterAxis = boardSettings.letterAxis;
  const fleetModel = AIFleetModel();
  const shipNames = [];
  fleetData.forEach((ship) => {
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

  const placeShips = () => {
    const placementGenerator = PlacementCoordinatesGenerator(model.mainGrid.get());
    const placements = placementGenerator.calculateRandomShipPlacements(model.fleet.getData());
    placements.forEach(({ id, placement }) => {
      model.mainGrid.place(id, placement[0], placement[placement.length - 1]);
      model.fleet.setShipPlacementCoordinates(id, placement);
    });
  };

  const board = {
    id: model.properties.id,
    name: model.properties.getName(),
    provideTrackingGrid: () => view.trackingGrid.elements.getGrid(),
    provideTrackingFleet: () => view.fleet.getTrackingFleet(),
    placement: {
      start: (handleFinalize) => {
        placeShips();
        if (!model.fleet.isAllShipsPlaced()) throw new Error('AI Error: Not all ships placed.');
        else handleFinalize();
      },
      end: () => {}
    },
    combat: {
      manager: null,
      init: (sendEndTurn) => {
        if (board.combat.manager) return;
        board.combat.manager = AiCombatManager({ sendEndTurn, model, view, letterAxis });
      },
      start: ({ sendAttack, sendResult, sendShipSunk, sendLost, sendEndTurn }) => {
        if (!board.combat.manager) throw new Error(`Ai Combat Manager Not initialized`);
        board.combat.manager.initializeCombat({
          sendAttack,
          sendResult,
          sendShipSunk,
          sendLost,
          sendEndTurn
        });
      },
      getHandlers: () => board.combat.manager.getHandlers(),
      startTurn: () => board.combat.manager.startTurn(),
      end: () => {
        if (!board.combat.manager) return;
        board.combat.manager.endCombat();
      }
    }
  };

  return {
    getPlayerModel: () => model.properties,
    isAllShipsSunk: () => model.fleet.isAllShipsSunk(),
    sendAttack,
    board
  };
};
