// import addBaseAILogic from './ai/base/BaseAICore';
// import addIntermediateLogic from './ai/intermediate/IntermediateAICore';
// import addAdvancedLogic from './ai/advanced/AdvancedAICore';
import { AIModel } from './model/AIModel';
import { AIMainGridModel } from './components/MainGrid/AIMainGridModel';
import { AITrackingGridModel } from './components/TrackingGrid/AITrackingGridModel';
import { AIFleetModel } from './components/Fleet/AIFleetModel';
import { AIShipModel } from './components/Ship/AIShipModel';
import { AI_NAMES, STATUSES } from './common/constants';

import { PlacementManager } from '../PlacementManager';

export const AIController = ({ difficulty, boardSettings, shipData }) => {
  const mainGridModel = AIMainGridModel(boardSettings.numberOfRows, boardSettings.numberOfCols);
  const trackingGridModel = AITrackingGridModel(
    boardSettings.numberOfRows,
    boardSettings.numberOfCols
  );
  const fleetModel = AIFleetModel();
  shipData.forEach((ship) => {
    const shipModel = AIShipModel(ship.length, ship.name);
    fleetModel.addMainShip(shipModel);
    fleetModel.addTrackingShip(shipModel.getID(), ship.length);
  });
  const model = AIModel({
    aiName: AI_NAMES[difficulty],
    difficulty,
    fleetModel,
    mainGridModel,
    trackingGridModel
  });
  const placementManager = PlacementManager(model.mainGrid.get());

  /**
   * Randomly places the AI's fleet onto it's board's main grid.
   * @returns {void}
   */
  const placeShips = () => {
    const placements = placementManager.calculateRandomShipPlacements(model.fleet.getData());
    placements.forEach(({ id, placement }) => {
      model.mainGrid.place(placement[0], placement[placement.length - 1]);
      model.fleet.setShipPlacementCoordinates(id, placement);
    });
  };

  return {
    isAI: () => model.properties.isAI(),
    placeShips
  };
};
