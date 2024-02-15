import { MainGridController } from '../../../MainGrid/MainGridController';
import { TrackingGridController } from '../../../TrackingGrid/TrackingGridController';
import { BoardCoordinator } from '../../../Board/BoardCoordinator';

export const initializeBoard = (boardConfigData, fleetController) => {
  const mainGridController = MainGridController(boardConfigData);
  const trackingGridController = TrackingGridController(boardConfigData);
  mainGridController.initializeSateManagement();
  trackingGridController.initializeStateManagement();
  const boardCoordinator = BoardCoordinator({
    mainGridController,
    trackingGridController,
    fleetController
  });
  return { mainGridController, trackingGridController, boardCoordinator };
};
