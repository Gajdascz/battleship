# [Game Component](../README.md#components-overview)

The Game Component orchestrates the fundamental structure and logic essential for the game flow and
coordination. It is composed of various modules and managers that work in together to provide a
dynamic game experience.

## GameCoordinator

The Game Coordinator is a core module designed to orchestrate the game's lifecycle, managing
transitions between game states—start, placement, combat, and end. It coordinates interactions among
various components for seamless game play and interaction.

Implemented as an Immediately Invoked Function Expression (IIFE), the Game Coordinator automatically
initializes upon import, providing immediate game setup and execution.

**Functionality**

- **State Management**: Leverages GameStateController for navigating game states.
- **Event Handling**: Manages game events through the publisher-subscriber communication system,
  ensuring component synchronization.
- **Dynamic Transitions**: Responds to game play changes, guiding the game through different states.
- **Modular Design**: Works with manager modules for combat, player management, and turn sequencing,
  supporting a scalable architecture.

## GameStateController

The GameStateController is designed to manage the game's state transitions and flow. It provides a
structured approach to moving between different stages of game, such as starting the game,
transitioning to new phases, and handling exit conditions.

**Functionality**

- **State Management**: Initializes with a set of possible game states and manages transitions
  between them.
- **Event Handling**: Supports registering callbacks for onEnter and onExit events for each state,
  allowing for custom actions during state transitions.
- **Dynamic Transitions**: Facilitates moving from one state to another, executing associated enter
  and exit callbacks to ensure a smooth transition.
- **Lifecycle Control**: Offers methods to start the game, transition states, and exit the current
  state, encapsulating the game's flow logic.

## State Coordinators

Each state's logic and event-communication is encapsulated in it's own coordinator. These
coordinators utilize various methods and managers to facilitate game play requirements.

### StartStateCoordinator

The Start State Coordinator is the initial phase in the game, responsible for setting up the game
environment based on predefined settings. This phase focuses on initializing players, configuring
board controllers, and establishing the foundational structures for turn management and event
handling.

Upon initialization returns an object containing a `PlayerManager`, `TurnManager`, and
`EventManager` instance.

**Functionality**

- **Player Initialization**: Utilizes `initializePlayer` to set up player instances with specific
  settings, including board configurations and default fleet compositions.
- **Board Controllers Configuration**: Employs `configureBoardControllers` to prepare the game
  boards for each player, adjusting for the selected game mode (Human vs. Human, AI vs. AI, Human
  vs. AI).
- **Event Management Setup**: Establishes a global and scoped event system through GameEventManager,
  defining events for game start, placement completion, and combat progression.
- **Turn Management**: Integrates `GameTurnManager` to handle turn sequencing between players,
  facilitating the start and end of each player's turn based on the game's progression.

### PlacementStateCoordinator

The Placement State Coordinator orchestrates the initialization and flow of the players placement
phase.

Upon initialization returns a `start` and `reset` function for entering and exiting the state within
the game state controller/game coordinator.

**Functionality**

- **Initialization**: Initializes and handles the placement state's flow.
- **Event Driven Communication**: Utilizes provided methods for communicating when a player's
  placements have been finalized. Once this occurs, it processes the current state of each player
  and if all players have finalized their placements, will transition to the next state. Otherwise
  switches players and executes their placement phase.

### CombatStateCoordinator

The Combat State Coordinator orchestrates the initialization and flow of the game's combat phase.
Players take turns sending and receiving attacks through interacting with the interface.

Upon initialization returns a `start` and `reset` function for entering and exiting the state within
the game state controller/game coordinator.

**Functionality**

- **Combat Manager Integration**: Establishes a combat environment by initializing the CombatManager
  with player-specific combat data and events.
- **Event Handling**: Utilizes eventMethods for enabling and disabling actions within the combat
  phase, ensuring responsive and interactive game play.
- **Player Combat Controllers**: Manages each player's combat actions through combatControllers,
  facilitating attack execution, defense, and turn management.
- **End Turn Management**: Deploys EndTurnButtonManager for human players in a Human vs. Human game
  mode, providing a UI element to end the current player's turn.
- **Controllers**: Activates combat controllers for each player, setting up necessary listeners and
  preparing players for combat engagement.
- **Dynamic Turn Management**: Adjusts to the game's flow by coordinating turn starts and ends,
  integrating with the game's turn manager.
- **Adaptability**: Adapts to different game modes (HvH, AvA, HvA) by appropriately configuring
  combat and UI elements.
- **Reset**: Provides a reset function to clear the combat state and removing event listeners and UI
  elements.

## License

Copyright © 2024 Nolan Gajdascz | [GitHub](https://github.com/Gajdascz)

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file
for details.
