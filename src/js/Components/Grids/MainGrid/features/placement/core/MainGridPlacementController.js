import { MAIN_GRID_EVENTS } from '../../../common/mainGridEvents';
import { MainGridPlacementView } from './MainGridPlacementView';
import { convertToInternalFormat } from '../../../../../../Utility/utils/coordinatesUtils';
export const MainGridPlacementController = ({ model, view, publisher, componentEmitter }) => {
  const previewConfig = {
    gridElement: view.elements.getWrapper(),
    getCell: view.getCell,
    maxVertical: model.getMaxVertical(),
    maxHorizontal: model.getMaxHorizontal(),
    letterAxis: model.getLetterAxis()
  };
  const placementView = MainGridPlacementView({
    mainGridElement: view.elements.getGrid(),
    submitPlacementsButtonElement: view.elements.getSubmitPlacementsButton(),
    previewConfig
  });

  const execute = {
    placementRequest: ({ data }) => {
      const { id, length } = data;
      const placedCoordinates = placementView
        .processPlacementRequest({ length, id })
        ?.map(convertToInternalFormat);
      if (!placedCoordinates) return;
      model.place(placedCoordinates, id);
      publisher.scoped.noFulfill(MAIN_GRID_EVENTS.PLACEMENT.ENTITY_PLACEMENT_PROCESSED, {
        placedCoordinates
      });
    },
    removeEntity: ({ data }) => {
      const { id } = data;
      model.removePlacedEntity(id);
    },
    shipSelected: ({ data }) => {
      const { id, length, orientation } = data;
      if (model.isEntityPlaced(id)) execute.removeEntity({ data });
      placementView.update.preview.selectedShip({ id, length, orientation });
    },
    orientationToggle: ({ data }) => {
      const { orientation } = data;
      placementView.update.preview.orientation(orientation);
    },
    placementsFinalized: () => {
      stateManager.end();
      publisher.scoped.noFulfill(MAIN_GRID_EVENTS.PLACEMENT.FINALIZED);
    },
    toggleSubmitPlacementsButton: ({ data }) => {
      const { isReady } = data;
      if (isReady) placementView.enable.submitPlacements();
      else placementView.disable.submitPlacements();
    }
  };

  const stateManager = {
    isInitialized: false,
    isEnabled: false,
    subscriptions: [
      {
        event: MAIN_GRID_EVENTS.PLACEMENT.TOGGLE_PLACEMENT_SUBMISSION_REQUEST,
        callback: execute.toggleSubmitPlacementsButton
      },
      { event: MAIN_GRID_EVENTS.PLACEMENT.ENTITY_SELECTED, callback: execute.shipSelected },
      {
        event: MAIN_GRID_EVENTS.PLACEMENT.ENTITY_ORIENTATION_UPDATED,
        callback: execute.orientationToggle
      },
      {
        event: MAIN_GRID_EVENTS.PLACEMENT.ENTITY_PLACEMENT_REQUESTED,
        callback: execute.placementRequest
      }
    ],
    subscribe: () => componentEmitter.subscribeMany(stateManager.subscriptions),
    unsubscribe: () => componentEmitter.unsubscribeMany(stateManager.subscriptions),
    initialize: () => {
      if (stateManager.isInitialized) return;
      stateManager.subscribe();
      placementView.initialize(execute.placementsFinalized);
      stateManager.isInitialized = true;
      publisher.scoped.requireFulfill(MAIN_GRID_EVENTS.PLACEMENT.GRID_INITIALIZED, {
        container: view.elements.getGrid()
      });
    },
    enable: () => {
      if (stateManager.isEnabled) return;
      placementView.enable.preview();
      stateManager.isEnabled = true;
    },
    disable: () => {
      if (!stateManager.isEnabled) return;
      placementView.disable.preview();
      placementView.placement.submitButton.disable();
      stateManager.isEnabled = false;
    },

    end: () => {
      if (!stateManager.isInitialized) return;
      stateManager.unsubscribe();
      placementView.end();
      stateManager.isInitialized = false;
    }
  };

  componentEmitter.subscribe(
    MAIN_GRID_EVENTS.PLACEMENT.INITIALIZE_REQUESTED,
    stateManager.initialize
  );
  componentEmitter.subscribe(MAIN_GRID_EVENTS.PLACEMENT.END_REQUESTED, stateManager.end);
};
