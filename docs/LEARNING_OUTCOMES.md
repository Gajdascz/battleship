# Learning Outcomes

Over an intensive three-month period, I embarked on the development and subsequent redevelopment of
my Battleship project. Unfortunately, the initial implementation is lost due to eager refactoring.
Regardless, this experience has been immensely educational and rewarding, serving as milestone in my
aspiring development career.

## Initial Implementation

The project's first iteration employed DOM-level event emission, using custom events and traditional
event listeners for inter-component communication. Although this method was effective, it led to a
design where game logic and state management were interwoven, resulting in a tightly coupled and
somewhat incoherent architecture that posed challenges in terms of manageability and comprehension.
Nevertheless, this phase provided crucial insights into:

- **DOM-Event Communications**: Introduced to component communication via custom events, setting a
  foundation for understanding event-driven architectures.
- **Basic State Management**: Gained insights into managing game states in interactive environments,
  essential for dynamic application development.
- [**AI Development**](../src/js/Components/AI/README.md): Tackled the challenge of designing
  strategic AI, enhancing my algorithmic problem-solving skills.

## Revised Implementation

Upon reflection, I recognized the necessity for a more cohesive and modular architecture. This
insight led me to introduce myself to and embrace the Model View Controller (MVC) pattern,
significantly altering my approach to project structuring and logic encapsulation. Also, moving away
from DOM-level events I decided to teach myself about the publisher/subscriber system. This allowed
me to achieve greater modularity and separation of concerns. Learning about and adopting these
patterns afforded me invaluable and incredibly rewarding experience.

- [**Model View Controller Pattern**](../src/js/Components/README.md): Adopted MVC for clearer
  component roles, improving project modularity and maintainability.
- [**Publisher Subscriber Pattern**](../src/js/Events/README.MD): Explored event-driven systems
  beyond DOM events, advancing my understanding of software architecture patterns.

This project was not only a profound learning experience but also a practice in remaining resilient,
adaptable, and committed to taking pride in my work and efforts. As someone who thoroughly enjoys
solving complex problems and continuous learning, I look forward to continue growing as a developer.

## License

Copyright © 2024 Nolan Gajdascz | [GitHub](https://github.com/Gajdascz)

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file
for details.
