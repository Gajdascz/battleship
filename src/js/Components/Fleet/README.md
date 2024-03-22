# [Fleet Component](../README.md#components-overview)

The tracking grid encapsulates all outgoing attack logic and display.

## [Controller](../../README.md#controller)

**Initialization:**

- Requires `fleetShipControllers` containing the fleet's `ShipController` objects,

  **Methods:**

  - `getPlacementManager()`: Provides access to the placement manager.
  - `getCombatManager()`: Allows interaction with the combat manager.
  - `view`: Returns the view interface.
  - `getModel()`: Returns the fleet's model.
  - `getTrackingFleet()`: Provides the tracking fleet element.
  - `assignShipToFleet()`: Assigns a ship controller to the fleet.

## [Model](../../README.md#model)

Encapsulates game state critical information such as whether all ships are sunk or placed as well as
properties and methods for managing ship components.

## [Managers](../../README.md#managers)

### FleetPlacementManager

Coordinates the placement logic of ship components across the fleet, facilitating interaction and
event-driven responses related to ship selection, placement, and orientation.

**Functionalities**

- **Select Ship**: Activates a specific ship for placement, updating the selection status across all
  ship managers. Emits selection data, including any UI elements associated with the selected ship
  (e.g., rotation button).
- **Place Ship**: Places the currently selected ship at the specified coordinates on the grid.
  Verifies selection status before placement and updates the game state to reflect the placement.
  Triggers an update if all ships are placed.
- **Orientation Toggle**: Listens for changes in ship orientation and broadcasts these changes to
  all ship placement managers, allowing for dynamic updates to ship placement orientation.
- **All Ships Placed**: Upon placement/selection checks if all ships are placed and updates the
  state accordingly. Emits an event notifying subscribers of the state change.

### FleetCombatManager

Coordinates combat operations across the fleet, focusing on hit detection and tracking ship
statuses.

**Functionalities**

- **Hit**: Targets a ship by ID, delegating the hit process to the ship's combat manager.
- **Ship Hit Events**: Enables or disables callback functions for ship hit events across all ship
  combat managers.
- **Ship Sunk Events**: Enables or disables callback functions for ship sunk events across all ship
  combat managers.
- **All Ships Sunk**: Checks and emits an event when all ships are sunk.

## License

Copyright © 2024 Nolan Gajdascz | [GitHub](https://github.com/Gajdascz)

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file
for details.
