# [Ship Component](../README.md#components-overview)

The ship is a core piece of the Battleship game experience. It's directly involved in all aspects
and phases of the game.

## [Controller](../README.md#controller)

**Initialization:**

- Requires `shipData`, containing the ship's `name` and `length`, to create an instance of the
  ship's model and view.

**Methods:**

- `getMainShipElement()`: Retrieves the main ship element from the view.
- `getTrackingShipElement()`: Obtains the tracking ship element from the view.
- `getPlacementManager()`: Provides access to the placement manager.
- `getCombatManager()`: Allows interaction with the combat manager.
- `getModel()`: Returns the ship model instance.
- `getView()`: Gives access to the ship view instance.

## [Model](../README.md#model)

Encapsulates the essential attributes and methods necessary for managing ship entities data and
state within the game.

## [Managers](../README.md#managers)

### SelectionAndPlacementManager

The `SelectionAndPlacementManager` orchestrates ship placement and interaction utilizing the
`ShipSelectionController`, `ShipSelectionView`, and `ShipPlacementController`, for actual placement
logic and view updates.

**Functionalities:**

- **_Selection_**: Executes directly upon player action. When a ship is selected, this manager emits
  an event to its subscribers, passing the ship's id, length, and orientation to their callbacks.
  This facilitates immediate updates across the game interface, reflecting the current selection
  state.

- **_Placement_**: Upon placing a ship and receiving the placement coordinates, the manager triggers
  an event, communicating that the placement has occurred to it's subscribers. This event provides
  no data and is used to update it's subscribers to allow responsive action.

- **_Orientation Toggling_**: Allows players to adjust the orientation of their selected ship. An
  event is emitted following the execution of an orientation change, providing subscribers with the
  new orientation value. This ensures that the game's UI can respond dynamically to player actions.

### ShipCombatManager

The ShipCombatManager handles ship's combat interactions within the game, managing the processes of
ship hits and sinking. This manager works with the ship's model and view to provide real-time
feedback on the state of each ship during combat.

**Functionalities:**

- **_Hit_**: Upon executing a hit action, the manager decrements the ship's health and checks for a
  sink condition. It then emits a shipHit event, providing subscribers with the ship's id and the
  isSunk status. This allows for immediate visual and game state updates across the game interface,
  reflecting the impact of combat actions.

- **_Sinking_**: If a ship's health reaches zero, the ShipCombatManager triggers a shipSunk event,
  marking the ship as sunk within the game's view and model. This event, emitting the sunk ship's
  id, notifies all subscribed components, enabling them to respond accordingly.
