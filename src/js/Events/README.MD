# Event System

The Battleship application utilizes a publisher-subscriber architecture to facilitate, event-driven
and application-wide communication. This approach deviates from the conventional use of a singular,
global event emitter, opting instead for distinct EventEmitter instances. These instances are
tailored with abstracted interfaces to cater to the specific needs of individual components and
their unique use-cases.

Opting for a publisher/subscriber model was motivated by two primary factors: firstly, to learn and
understand this design pattern, and secondly, to create an application with loosely coupled
components. This choice allows for a more dynamic, responsive communication framework, allowing
components to interact and react to events with greater flexibility and minimal dependencies.

## Event Emitter

The EventEmitter is the core of this system which orchestrates communication across the application.
It enables decoupled components to dynamically subscribe to and react to events emitted elsewhere in
the system. Subscribers can register callbacks to specific events, which are then executed in
response to those events being published. Furthermore, publishers have the ability to attach a data
payload to each event, providing subscribers with the context or data needed to react appropriately.

### Simple Example:

Consider two components:

- **Component B** acts as a publisher, creating a 'HELLO' event that carries a 'hello world'
  payload.
- **Component A** subscribes to Component B's 'HELLO' event with its acceptGreeting() callback,
  designed to log the received payload to the console.

When Component B emits the 'HELLO' event, Component A's acceptGreeting() callback is triggered,
processing the event's payload: acceptGreeting('hello world').

### Methods

- `subscribe(eventName, callback)`: Registers a callback to be executed in response to a specified
  event.
- `subscribeMany([{event: eventName, callback: function}])`: Registers multiple callbacks to various
  events in one operation, expecting an array of objects detailing event names and corresponding
  callbacks.
- `unsubscribe(eventName, callback)`: Deregisters a callback for a specified event, preventing it
  from being executed on future occurrences of the event.
- `unsubscribeMany([{event: eventName, callback: function}])`: Removes multiple subscriptions at
  once, based on an array of event names and callbacks.
- `publish(eventName, payload=null)`: Publishes an event to all its subscribers, optionally
  including a data payload.
- `reset()`: Clears all subscriptions from the EventEmitter, effectively resetting its state.

## Managers

The managers are designed to streamline event-driven communication among multiple components and
abstract the system's internal workings. These specialized entities ensure a unified and
straightforward approach to managing events across the application.

### EventDefinitionManager

The EventDefinitionManager is designed to specifically manage the event definitions that occur
within the system. It acts as a centralized hub for defining, scoping, and managing the various
event types that the application might trigger or listen for.

#### Event Types:

- **global:** Signifies events of application-wide importance, transcending specific component
  scopes.
- **base:** Represents a set of general events that can be used as templates for creating more
  specific, scoped events.
- **scoped:** Derived from base events, these are tied to specific contexts or scopes, enabling
  targeted communication.

#### Methods:

- `createKey(scope, eventName)`: Generates a unique identifier for a scoped event, following the
  format 'scope@event'.
- `addScope(scope)`: Registers a new scope within the system, preparing it for scoped event
  generation.
- `removeScope(scope)`: Eliminates a previously defined scope and its associated events from the
  system.
- `buildScopedEvents()`: Dynamically generates scoped events for each registered scope based on the
  current base events.
- `setBaseEvents(eventsObj)`: Updates the set of base events and automatically regenerates scoped
  events to reflect the changes.
- `setGlobalEvents(eventsObj)`: Defines events that are accessible throughout the entire
  application, irrespective of specific component scopes.
- `getGlobalEvents()`: Retrieves the current set of global events.
- `getBaseEvents()`: Provides access to the defined base events.
- `getScopedEvents()`: Returns all scoped events, organized by their respective scopes.
- `getBaseTypes()`: Offers a lookup for the original base event types, before they were scoped.
- `reset()`: Resets the EventDefinitionManager, clearing all event definitions and scopes.

### EventManager

The EventManager serves as the link between individual components and the broader event emitter
system. It simplifies event management by offering a uniform and intuitive interface by abstracting
the complexity of direct emitter interaction. Additionally, It monitors all event subscriptions,
ensuring efficient memory usage by preventing leaks.

#### Methods:

- `on(eventName, callback)`: Registers a callback to be invoked in response to a specific event.
- `off(eventName, callback)`: Removes a previously registered callback for a given event, ceasing
  its execution in response to future triggers of that event.
- `offAll()`: Detaches all callbacks currently registered through the EventManager, effectively
  resetting its state of active subscriptions.
- `emit(eventName, payload=null)`: Triggers an event, optionally carrying a payload, which is then
  passed to all subscribed callbacks.
- `events`: Exposes the EventDefinitionManager interface, allowing direct access to event
  definitions and management functionalities.
- `reset()`: Performs a comprehensive cleanup by unsubscribing all active event subscriptions and
  resetting the internal state of the EventManager.

### EventHandler

The EventHandler manages communication for specific events, offering a more detailed and targeted
approach. Designed for use by individual components, it handles interactions with a singular event,
providing a streamlined and unified interface. This allows components not only to emit events but
also enables external entities to subscribe to and respond to these events efficiently.

#### Methods:

- `emit(args)`: Triggers the designated event, forwarding any supplied arguments to the subscribed
  callbacks.
- `on(callback)`: Registers a callback to be invoked whenever the event is emitted.
- `off(callback)`: Removes a previously registered callback, ceasing its execution in response to
  the event.
- `setPreEmitCallback(callback)`: Assigns a callback to be executed immediately before the event is
  emitted. This pre-emit callback allows for the preparation or aggregation of data that will be
  passed to the event's subscribers.
- `reset()`: Clears all subscriptions linked to the event and resets the EventHandler's internal
  state.

## License

Copyright © 2024 Nolan Gajdascz | [GitHub](https://github.com/Gajdascz)

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file
for details.
