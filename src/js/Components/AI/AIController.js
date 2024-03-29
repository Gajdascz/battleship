import { AIModel } from './model/AIModel';
import { AIMainGridModel } from './components/MainGrid/AIMainGridModel';
import { AITrackingGridModel } from './components/TrackingGrid/AITrackingGridModel';
import { AIFleetModel } from './components/Fleet/AIFleetModel';
import { AIShipModel } from './components/Ship/AIShipModel';
import { AI_NAMES } from '../../Utility/constants/common';

import { AIView } from './AIView';
import { PlacementCoordinatesGenerator } from './Managers/Placement/PlacementCoordinatesGenerator';

import { AiCombatManager } from './Managers/Combat/AiCombatManager';

export const AIController = ({ id, difficulty, attackDelay, boardSettings, fleetData }) => {
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
    shipNames.push(shipModel.getName());
  });
  const model = AIModel({
    aiName: AI_NAMES[difficulty],
    id,
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
      init: () => {
        if (board.combat.manager) return;
        board.combat.manager = AiCombatManager({ model, view, letterAxis, attackDelay });
      },
      start: ({ sendAttack, sendResult, sendLost, endTurnMethod }) => {
        if (!board.combat.manager) throw new Error(`Ai Combat Manager Not initialized`);
        board.combat.manager.initializeCombat({
          sendAttack,
          sendResult,
          sendLost,
          endTurnMethod
        });
      },
      getHandlers: () => board.combat.manager.getHandlers(),
      startTurn: () => board.combat.manager.startTurn(),
      end: () => {
        if (!board.combat.manager) return;
        board.combat.manager.reset();
        board.combat.manager = null;
      }
    },
    reset: () => {
      board.combat.end();
      model.reset();
    }
  };

  return {
    getPlayerModel: () => model.properties,
    isAllShipsSunk: () => model.fleet.isAllShipsSunk(),
    sendAttack,
    board
  };
};
