import { DEFAULT_FLEET } from '../../utility/constants/components/fleet';
import { BoardCoordinator } from './BoardCoordinator';
import { PlayerModel } from '../Player/PlayerModel';
import { buildMainGridComponent } from '../../builders/MainGrid/buildMainGridComponent';
import { buildTrackingGridComponent } from '../../builders/TrackingGrid/buildTrackingGridComponent';
import { buildFleetComponent } from '../../builders/Fleet/buildFleetComponent';
import { buildShipComponent } from '../../builders/Ship/buildShipComponent';
import { handle } from './utility/controllerHandlers';

export const GameController = (gameModel, gameView) => {
  const _model = gameModel;
  const _view = gameView;

  const initiateStartState = () => {
    handle.startGame(_model);
  };

  const initializeBoardCoordinator = ({
    mainGridController,
    trackingGridController,
    fleetController
  }) => {
    const boardCoordinator = BoardCoordinator({
      mainGridController,
      trackingGridController,
      fleetController
    });
  };

  const populateFleet = (fleetController, fleetShipsData) =>
    fleetShipsData.forEach((ship) => {
      const shipController = buildShipComponent(ship);
      const shipModel = shipController.getModel();
      const shipElement = shipController.getElement();
      fleetController.assignShipToMainFleet(shipModel, shipElement);
    });

  const initializePlayer = ({ playerData, boardConfigData, fleetShipsData = DEFAULT_FLEET }) => {
    const playerModel = PlayerModel({ name: playerData.name, id: playerData.id });
    const mainGrid = buildMainGridComponent(boardConfigData);
    const trackingGrid = buildTrackingGridComponent(boardConfigData);
    const fleet = buildFleetComponent();
    populateFleet(fleet, fleetShipsData);
    initiateStartState();
    return { playerModel, mainGrid, trackingGrid, fleet };
  };

  const initializePlayers = ({ p1Data, p2Data }) => {
    const p1 = initializePlayer({
      playerData: p1Data.playerData,
      boardConfigData: p1Data.boardConfigData,
      fleetShipsData: p1Data.fleetShipsData
    });
    initializeBoardCoordinator({
      mainGridController: p1.mainGrid,
      trackingGridController: p1.trackingGrid,
      fleetController: p1.fleet
    });
  };

  const transition = () => {};

  const switchCurrentPlayer = () => {};

  const setToPlacementState = () => {};

  const setToProgressState = () => {};

  return {
    initializePlayers
  };
};
