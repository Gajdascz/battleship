# [MainGrid Component](../../README.md#components-overview)

The main grid encapsulates all placement and incoming attack logic and display.

## [Controller](../../README.md#controller)

**Initialization:**

- Requires `boardConfig` containing the grid's `numberOfRows`, `numberOfCols`, `letterAxis`

  **Methods:**

- `getPlacementManager()`: Provides access to the placement manager.
- `getCombatManager()`: Allows interaction with the combat manager.
- `view: { ... }`: Various methods for manipulating the grid's interface.

## [Model](../../README.md#model)

- Manages the grid's internal 2D array structure which consists of cell Objects. Cell objects
  contain a status property and an id property if an entity is placed within it.
- Maintains the grid's dimensions and enforces boundaries to ensure game play remains within a
  manageable and logical space.
- Tracks each cell's status, distinguishing between empty, occupied, and targeted states to
  accurately reflect the current game state.
- Facilitates interactions with the grid, such as placing and removing entities through the
  `EntityPlacementManager`, providing a clear and accessible API.
- Processes incoming actions (e.g., attacks) and updates the grid state accordingly, providing
  immediate feedback on the results of these actions.

## [Managers](../../README.md#managers)

### MainGridPlacementManager

Facilitates entity placement and interaction on the main game grid utilizing the
`MainGridPlacementController` and `MainGridPlacementView` for actual placement logic and view
updates. The placement view relies on the `PreviewManager` to calculate and display placement
previews.

**Functionalities:**

- **Place Entities**: Processes a placement request, and emits an event with the placement
  coordinates.
- **Submit Placements**: Handles the finalization and submission of all entity placements on the
  grid. On execution, triggers a submission event and resets the placement state.
- **Toggle Submit**: Enables or disables the submission action based on game state, such as whether
  all required entities are placed correctly.

### MainGridCombatManager

Handles processing incoming attacks and emitting the result.

-**Process Incoming Attack**: Accepts an attack's coordinates, updates the grid based on the
outcome, updates the interface, and emits the coordinates and result to subscribers.

## License

Copyright © 2024 Nolan Gajdascz | [GitHub](https://github.com/Gajdascz)

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file
for details.
