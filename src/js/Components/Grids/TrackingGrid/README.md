# [TrackingGrid Component](../../README.md#components-overview)

The tracking grid encapsulates all outgoing attack logic and display.

## [Controller](../../README.md#controller)

**Initialization:**

- Requires `boardConfig` containing the grid's `numberOfRows`, `numberOfCols`, `letterAxis`

  **Methods:**

- `getCombatManager()`: Allows interaction with the combat manager.
- `view: { ... }`: Various methods for manipulating the grid's interface.

## [Model](../../README.md#model)

- Not currently used.

## [Managers](../../README.md#managers)

### TrackingGridCombatManager

Manages event-driven combat communication by handling outgoing attack logic and result handling.

**Functionalities:**

- **Outgoing Attack**: Handles the initiation of attacks through user actions into game events. Once
  executed, emits an carrying the converted attack coordinates as data.
- **Accept Result**: Processes the outcome of sent attacks by updating the grid's display according
  to the result received. Upon processing, it emits an event to notify subscribers.

## License

Copyright © 2024 Nolan Gajdascz | [GitHub](https://github.com/Gajdascz)

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file
for details.
