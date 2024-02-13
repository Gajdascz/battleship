import { buildMainGridComponent } from '../../../../builders/MainGrid/buildMainGridComponent';
import { buildTrackingGridComponent } from '../../../../builders/TrackingGrid/buildTrackingGridComponent';
import { BoardCoordinator } from '../../BoardCoordinator';

export const initializeBoard = (boardConfigData, fleetController) => {
  const mainGridController = buildMainGridComponent(boardConfigData);
  const trackingGridController = buildTrackingGridComponent(boardConfigData);
  const boardCoordinator = BoardCoordinator({
    mainGridController,
    trackingGridController,
    fleetController
  });
  return { mainGridController, trackingGridController, boardCoordinator };
};
