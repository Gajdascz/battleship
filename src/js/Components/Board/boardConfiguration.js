const BOARD_CLASSES = {
  MAIN_GRID_UTILITY_CONTAINER: 'main-grid-utility-container',
  TRACKING_GRID_UTILITY_CONTAINER: 'tracking-grid-utility-container',
  MAIN_GRID_BUTTON_CONTAINER: 'main-grid-button-container'
};
const BOARD_ELEMENT_IDS = {
  MAIN_GRID: 'mainGrid',
  TRACKING_GRID: 'trackingGrid',
  MAIN_FLEET: 'mainFleet',
  TRACKING_FLEET: 'trackingFleet',
  MAIN_GRID_UTILITY_CONTAINER: 'mainGridUtilityContainer',
  TRACKING_GRID_UTILITY_CONTAINER: 'trackingGridUtilityContainer',
  MAIN_GRID_BUTTON_CONTAINER: 'mainGridButtonContainer'
};

export const buildBoardConfig = ({ view, mainGrid, trackingGrid, fleet }) => {
  const { id: mainGridID, element: mainGridElement } = mainGrid.view.getWrapper();
  const { id: trackingGridID, element: trackingGridElement } = trackingGrid.view.getWrapper();
  const grids = [
    { id: mainGridID, element: mainGridElement },
    { id: trackingGridID, element: trackingGridElement }
  ];
  const utilityContainers = [
    {
      parent: mainGridID,
      id: BOARD_ELEMENT_IDS.MAIN_GRID_UTILITY_CONTAINER,
      class: BOARD_CLASSES.MAIN_GRID_UTILITY_CONTAINER
    },
    {
      parent: trackingGridID,
      id: BOARD_ELEMENT_IDS.TRACKING_GRID_UTILITY_CONTAINER,
      class: BOARD_CLASSES.TRACKING_GRID_UTILITY_CONTAINER
    }
  ];
  const { id: mainFleetID, element: mainFleetElement } = fleet.view.getMainFleet();
  const fleets = [
    {
      parent: BOARD_ELEMENT_IDS.MAIN_GRID_UTILITY_CONTAINER,
      id: mainFleetID,
      element: mainFleetElement
    }
  ];
  const buttonContainers = [
    {
      id: BOARD_ELEMENT_IDS.MAIN_GRID_BUTTON_CONTAINER,
      parent: BOARD_ELEMENT_IDS.MAIN_GRID_UTILITY_CONTAINER,
      class: BOARD_CLASSES.MAIN_GRID_BUTTON_CONTAINER
    }
  ];

  grids.forEach((grid) => view.addToBoard(grid.id, grid.element));
  utilityContainers.forEach((container) =>
    view.addUtilityContainerTo(container.parent, container.id, container.class)
  );
  fleets.forEach((fleet) => view.addToBoardElement(fleet.parent, fleet.id, fleet.element));
  buttonContainers.forEach((container) =>
    view.addButtonContainerTo(container.parent, container.id, container.class)
  );
  const buttonManagers = buttonContainers.map((container) =>
    view.getButtonContainerManager(container.id)
  );
  console.log(buttonManagers);
  if (buttonManagers.length === 1) return buttonManagers[0];
  else return buttonManagers;
};
