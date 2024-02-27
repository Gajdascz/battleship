import { MAIN_GRID_EVENTS } from '../utility/mainGridEvents';
import { MainGridPlacementView } from './MainGridPlacementView';
import { convertToInternalFormat } from '../../../../Utility/utils/coordinatesUtils';

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
    handle: {
      placementRequest: ({ data }) => {
        const { id, length } = data;
        const placedCoordinates = placementView
          .processPlacementRequest({ length, id })
          .map(convertToInternalFormat);
        model.place(placedCoordinates, id);
        if (!placedCoordinates) return;
        emit.placementCoordinatesProcessed(placedCoordinates);
      },
      removeEntity: ({ data }) => {
        const { id } = data;
        model.removePlacedEntity(id);
      },
      shipSelected: ({ data }) => {
        const { id, length, orientation } = data;
        if (model.isEntityPlaced(id)) execute.handle.removeEntity({ data });
        placementView.update.preview.selectedShip({ id, length, orientation });
      },
      orientationToggle: ({ data }) => {
        const { orientation } = data;
        placementView.update.preview.orientation(orientation);
      },
      placementsFinalized: () => {
        stateManager.end();
        emit.placementsFinalized();
      }
    }
  };

  const emit = {
    placementsFinalized: () => publisher.scoped.noFulfill(MAIN_GRID_EVENTS.PLACEMENT.FINALIZED),

    containerCreated: () =>
      publisher.scoped.requireFulfill(MAIN_GRID_EVENTS.PLACEMENT.GRID_INITIALIZED, {
        container: view.elements.getGrid()
      }),

    placementCoordinatesProcessed: (placedCoordinates) =>
      publisher.scoped.noFulfill(MAIN_GRID_EVENTS.PLACEMENT.ENTITY_PLACEMENT_PROCESSED, {
        placedCoordinates
      })
  };

  const stateManager = {
    isInitialized: false,
    isEnabled: false,
    subscribe: () => {
      componentEmitter.subscribe(
        MAIN_GRID_EVENTS.PLACEMENT.TOGGLE_PLACEMENT_SUBMISSION_REQUEST,
        stateManager.toggleSubmitPlacementsButton
      );
      componentEmitter.subscribe(
        MAIN_GRID_EVENTS.PLACEMENT.ENTITY_SELECTED,
        execute.handle.shipSelected
      );
      componentEmitter.subscribe(
        MAIN_GRID_EVENTS.PLACEMENT.ENTITY_ORIENTATION_UPDATED,
        execute.handle.orientationToggle
      );

      componentEmitter.subscribe(
        MAIN_GRID_EVENTS.PLACEMENT.ENTITY_PLACEMENT_REQUESTED,
        execute.handle.placementRequest
      );
      componentEmitter.subscribe(
        MAIN_GRID_EVENTS.PLACEMENT.FINALIZATION_REQUESTED,
        execute.finalizePlacements
      );
    },
    unsubscribe: () => {
      componentEmitter.unsubscribe(
        MAIN_GRID_EVENTS.PLACEMENT.TOGGLE_PLACEMENT_SUBMISSION_REQUEST,
        stateManager.toggleSubmitPlacementsButton
      );
      componentEmitter.unsubscribe(
        MAIN_GRID_EVENTS.PLACEMENT.ENTITY_SELECTED,
        execute.handle.shipSelected
      );
      componentEmitter.unsubscribe(
        MAIN_GRID_EVENTS.PLACEMENT.ENTITY_ORIENTATION_UPDATED,
        execute.handle.orientationToggle
      );
      componentEmitter.unsubscribe(
        MAIN_GRID_EVENTS.PLACEMENT.ENTITY_PLACEMENT_REQUESTED,
        execute.handle.placementRequest
      );
    },
    initialize: () => {
      if (stateManager.isInitialized) return;
      stateManager.subscribe();
      placementView.initialize(execute.handle.placementsFinalized);
      emit.containerCreated({ data: view.elements.getGrid() });
      stateManager.isInitialized = true;
      componentEmitter.subscribe(MAIN_GRID_EVENTS.PLACEMENT.END_REQUESTED, stateManager.end);
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
    toggleSubmitPlacementsButton: ({ data }) => {
      const { isReady } = data;
      if (isReady) placementView.enable.submitPlacements();
      else placementView.disable.submitPlacements();
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
};
