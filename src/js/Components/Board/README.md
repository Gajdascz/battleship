# [Board Component](../README.md#components-overview)

The board component brings all the individual components together to form a cohesive interface for
playing the game.

## [Controller](../../README.md#controller)

**Initialization:** Requires Object containing:

- **playerId**: Identifier of the player who's receiving the board controller instance.
- **playerName**: Name of the player who's receiving the board controller instance.
- **controllers**: Individual component controller Instances (mainGrid,trackingGrid,fleet).
- **gameMode**: Game mode based on player types.
- **displayContainer**: Where to display the board in the DOM.

**Methods and Properties:**

- **id**: Provided playerId.
- **name**: Provided player name.
- **view**: Board view interface.
- **provideTrackingFleet**: Returns the player's tracking fleet.
- **placement**: Interface for starting and ending the placement phase.
- **combat**: Interface for initializing, starting, ending, initiating the turn, and providing the
  handler functions of the combat phase.
- **reset**: Resets the board's state.

## [Managers](../../README.md#managers)

### BoardPlacementManager

Coordinates the placement logic between individual component placement managers and the game
session.

**External Requirements**

- **Communication Method (handleFinalize)**: to inform the game session the board's turn is over.
- **Component Placement Managers**:
  [fleetPlacementManager](../Fleet/README.md#fleetplacementmanager) and
  [mainGridPlacementManager](../Grids/MainGrid/README.md#maingridplacementmanager)

  **Functionalities**

- **Start Placement**: Initializes the board's placement manager by setting up user interaction
  listeners and individual component placement managers.
- **End Placement**: Executes the finalize communication method and resets the managers and state.

### BoardCombatManager

Coordinates the combat logic and communications between the individual component combat managers and
the game session (send and receive data between two players).

**External Requirements**

- **Communication Methods**: Methods to communicate combat actions between the board and game
  session (other player), including `sendAttack`, `sendResult`, `sendLost`, `endTurnMethod`.
- **Component Combat Managers**:
  [trackingGridCombatManager](../Grids/TrackingGrid/README.md#trackinggridcombatmanager),
  [fleetCombatManager](../Fleet/README.md#fleetcombatmanager),
  [mainGrid](../Grids/MainGrid/README.md#maingridcombatmanager)

**Functionalities**

- **initializeCombat**: Loads the combat manager and provides the communication methods.
- **startTurn**: Initiates the board's turn and updates the UI.
- **incomingAttackHandler**: Function to handle an incoming attack request.
- **incomingResultHandler**: Function to handle an incoming result from an outgoing attack.
- **reset**: Resets the components's combat managers and internal state.
