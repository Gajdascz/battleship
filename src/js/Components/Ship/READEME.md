# Ship

## Overview

The Ship component is a central element of the game, managing the individual ships' states,
including their placement, orientation, selection, and combat status. This document outlines the
component's functionality, focusing on state transitions and event handling facilitated by the
ShipController.

```mermaid
---
title: Ship States
---
stateDiagram-v2
    [*] --> Initialized: Start
    Initialized --> SelectionRequested: SHIP_EVENTS.SELECTION.REQUESTED
    SelectionRequested --> Selected: SHIP_EVENTS.SELECTION.SELECTED
    OrientationChanged --> Selected: SHIP_EVENTS.SELECTION.ORIENTATION_TOGGLED
    Selected --> Initialized: SHIP_EVENTS.SELECTION.DESELECTED
    Selected --> OrientationChanged: SHIP_EVENTS.SELECTION.ORIENTATION_TOGGLED
    Initialized --> PlacementEnabled: SHIP_EVENTS.PLACEMENT.CONTAINER_CREATED
    Selected --> PlacementEnabled: SHIP_EVENTS.PLACEMENT.CONTAINER_CREATED
    PlacementEnabled --> PlacementRequested: SHIP_EVENTS.PLACEMENT.REQUESTED
    PlacementRequested --> Placed: SHIP_EVENTS.PLACEMENT.SET
    Placed --> PlacementEnabled: Pick Up (Manual Action)
    Placed --> CombatReady: SHIP_EVENTS.PLACEMENT.READY

    note right of PlacementEnabled
      Placement Enabled occurs when the subscribed CONTAINER_CREATED
      event is fulfilled, enabling ship placement functionality.
    end note
```
