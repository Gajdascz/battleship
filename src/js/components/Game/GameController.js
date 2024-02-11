import { DEFAULT_FLEET } from '../../utility/constants/components/fleet';
import { BoardCoordinator } from './BoardCoordinator';
import { PlayerModel } from '../Player/PlayerModel';
import { buildMainGridComponent } from '../../builders/MainGrid/buildMainGridComponent';
import { buildTrackingGridComponent } from '../../builders/TrackingGrid/buildTrackingGridComponent';
import { buildFleetComponent } from '../../builders/Fleet/buildFleetComponent';
import { buildShipComponent } from '../../builders/Ship/buildShipComponent';

export const GameController = (gameModel, gameView) => {
  const _gameModel = gameModel;
  const _gameView = gameView;

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

  const populateFleet = (fleetController) => {
    DEFAULT_FLEET.map((ship) => {
      const shipController = buildShipComponent(ship);
      const shipModel = shipController.getModel();
      const shipElement = shipController.getElement();
      fleetController.assignShipToMainFleet(shipModel, shipElement);
    });
  };

  const addPlayers = ({ p1Data, p2Data, boardConfigData }) => {
    const p1Model = PlayerModel({ name: p1Data.name, id: p1Data.id });
    const p1Fleet = buildFleetComponent();
    const p1MainGrid = buildMainGridComponent({
      numberOfRows: 10,
      numberOfCols: 10,
      letterAxis: 'row'
    });
    const p1TrackingGrid = buildTrackingGridComponent({
      numberOfRows: 10,
      numberOfCols: 10,
      letterAxis: 'row'
    });
    populateFleet(p1Fleet);
    initializeBoardCoordinator({
      mainGridController: p1MainGrid,
      trackingGridController: p1TrackingGrid,
      fleetController: p1Fleet
    });
  };

  const transition = () => {};

  const switchCurrentPlayer = () => {};

  const setToPlacementState = () => {};

  const setToProgressState = () => {};

  return {
    addPlayers
  };
};
