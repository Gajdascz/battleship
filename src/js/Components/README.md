# Components Overview

In the game of Battleship, certain fundamental 'pieces' form the core of the game play experience.
This application organizes these fundamentals into structured components, following a flexible
'Model View Controller' (MVC) architecture and publisher/subscriber communication design. This
methodology is adapted to suit the game's requirements, deviating from the traditional MVC pattern
where necessary.

## Component Shared Implementation Details

The architecture and design philosophy behind every component share common principles, ensuring
consistency and modularity throughout the application.

### Controller

Each controller acts as the primary interface of its component, responsible for initializing core
functionalities and facilitating access to essential internal mechanisms. It orchestrates
interactions among the model, view, and managers.

### Model

At each component's heart is a central model, created to manage it's internal state and data. The
model is crucial for the dynamic management of the application's state, shared with specialized
managers by the controller to enable state modifications and updates as needed.

### View

A base view is present in every component, handling the management of primary visual elements. For
components with more complex requirements, extended views are utilized by sub-controllers to adapt
the interface to specific functional needs.

## Managers

Managers are central to enabling cross-component communication and specialized functionalities
within the game. They interact directly with the model to mirror game state changes and adjust the
view accordingly, updating the user interface in real time. The utilization of event handlers forms
a critical part of this system, serving as an abstraction layer for managing single-event
interactions within a component and facilitating cross-component communication via an internal event
emitter.

In more complex components, managers utilize sub-controllers, which act on the model, and extended
views, which cater to unique interface requirements. Sub-managers are also employed to handle more
intricate logic.

The interface provided by managers, feature methods to initialize and terminate their functionality.
It also includes mechanisms for subscribing `on[ManagerEvent](callback)` and unsubscribing
`off[ManagerEvent](callback)` to the component's internal events, allowing external entities to
react to changes within the component. Additionally, managers may expose action methods to perform
specific tasks within the component, typically resulting in an event emission

## License

Copyright © 2024 Nolan Gajdascz | [GitHub](https://github.com/Gajdascz)

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file
for details.
