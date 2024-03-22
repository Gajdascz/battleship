# AI

The game's ai allows players to compete against the computer at varying levels of difficulty. The
difficulty and attack delay can be configured through the settings dialog. The internal components
directory contains bare-bones implementations similar to those found in the parent Components
directory.

**Difficulties**

- _Easy_: Provides no strategy and attacks randomly on every turn.
- _Intermediate_: Provides some strategy by tracking the last known successful hit and backtracking
  until a ship is sunk. Once a ship is sunk, continues attacking randomly until another hit occurs.
- _Advanced_: Utilizes multiple strategies to intelligently send attacks and always sinks ships that
  have been hit efficiently.

## [Controller](../README.md#controller)

Provides an interface for integrating the AI within the existing battleship system. Initializes the
base components, model, view, and managers. The controller returns a simplified board interface to
interact with the internal managers similar to the Human's Board Controller.

## [Model](../README.md#model)

Aggregates the simplified components models into one cohesive interface for managing the AI's data
and state. Utilizes the `AvailableMovesManager` to track and provide valid moves from storage.

## [View](../README.md#view)

Creates a TrackingGridView instance and TrackingFleet element to provide a real-time view of the
AI's attacks to increase interactivity.

## [Managers](../README.md#managers)

The AI's managers do not use event handlers like the rest of the applications components. Instead,
they utilize internal methods and strategies to independently execute their phase logic.

### PlacementManager

The placement manager uses the `PlacementCoordinatesGenerator` to generate random placement
coordinates. Using these coordinates the AI executes ship placements and then executes the provided
`handleFinalize` function to communicate that it's finished.

Currently this is handled in the AIController's board interface as the logic is quite simple and
straightforward.

### AiCombatManager

The AiCombatManager mocks the Human Player's Board Controller implementation in that it accepts the
same event communication methods and follows the same internal structure. Where it deviates is in
it's automated use of these methods. First the manager gets the appropriate strategy based on the
selected difficulty. Each strategy provides it's own method for generating attack coordinates and
processing the results of the sent attack.
