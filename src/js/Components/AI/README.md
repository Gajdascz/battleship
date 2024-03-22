# AI

The game's AI allows players to compete against the computer at varying levels of difficulty. The
difficulty and attack delay can be configured through the settings dialog. The internal components
directory contains bare-bones implementations similar to those found in the parent Components
directory.

**Difficulties**

- **Easy**: The AI employs a non-strategic, random approach to its attacks.
- **Intermediate**: Utilizes a basic hit-tracking strategy, focusing attacks on adjacent tiles
  post-successful hit until a ship is sunk, then reverting to random attacks. If a chain of hits are
  followed and adjacent options are exhausted, it will 'backtrack' and target all adjacent cells to
  every hit in the chain.
- **Advanced**: Implements sophisticated strategies for efficient ship targeting and sinking,
  significantly enhancing its combat effectiveness.

## [Controller](../README.md#controller)

Integrates the AI into the existing Battleship system, providing a simplified board interface for AI
interaction that mirrors the human player’s board control, yet tailored for AI use.

## [Model](../README.md#model)

consolidates AI data and state management, utilizing the AvailableMovesManager to track and select
valid moves efficiently, ensuring uniqueness and strategic attack placements.

## [View](../README.md#view)

enhances game play interactivity by visually representing AI decisions in real-time, making the AI's
presence tangible through a TrackingGridView and TrackingFleet.

## [Managers](../README.md#managers)

AI managers execute logic independently, diverging from the event-driven approach of other
application components. This approach allows the AI component to be integrated into various game
implementations without having to be aware of the external dependencies.

### PlacementManager

This manager automates the process of ship placement, utilizing the `PlacementCoordinatesGenerator`
to determine random locations. Once placement is complete, the `handleFinalize` function signals
that the AI is ready to proceed.

### AiCombatManager

Mimicking the strategic considerations of a human player, the AiCombatManager autonomously selects
and processes attack coordinates based on the current difficulty level.

#### Advanced Strategy Overview

The advanced AI strategies involve sophisticated logic designed to simulate a highly skilled player:

**Basic Attack Validation**

The AI utilizes the `canShipFit` module to pre-validate potential attacks, ensuring moves are only
made on cells where the smallest remaining ship could feasibly be located. This early filtration
step prevents wasted moves.

**Probability Map**

A dynamic probability map is created from the initial game board, with each cell assigned a base
probability score. This score is adjusted as the game progresses, influenced by two key methods:

1. **`weightedCanShipFit`**: Enhances the base `canShipFit` logic by increasing the score for cells
   that can accommodate the opponent's smallest ship in multiple orientations.
2. **`calculateAdjacencyScore`**: Focuses on cells adjacent to successful hits, incrementally
   adjusting their scores based on exploration status and proximity to other significant cells.

**Chain and Chain Manager**

The chain is a custom data structure that's used for tracking and providing specific details on
cells containing consecutive hits. It provides critical data such as the orientation and the
directions after the head and tail.

The chain manager utilizes the chain to ensure that every hit that's registered is efficiently
resolved by sinking any and all ships they're related to. It does this by exhausting the hit chain
linearly, and if not every hit is resolved, it will then start a new chain at each unresolved hit
with a flipped orientation and then exhausts those chains until all hits are resolved.

**Hit Management**

The hit manager integrates with the probability map and chain manager for marking hits as
resolved/unresolved. Also, it tracks data including hits, sunken ship lengths, and provides valuable
insight into whether the total number of hits are equal to the total length of ships sunk

## License

Copyright © 2024 Nolan Gajdascz | [GitHub](https://github.com/Gajdascz)

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file
for details.
