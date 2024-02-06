import { isHTMLElement, throwError } from '../managerUtilities';

export default function UIManager() {
  const removeChildren = (element) => [...element.children]?.forEach((child) => child.remove());

  const updateTextContent = (element, text) => (element.textContent = text);

  const updateContainer = (container, newElement) => {
    if (!isHTMLElement(container)) throwError('container', 'HTMLElement', container);
    if (!isHTMLElement(newElement)) throwError('newElement', 'HTMLElement', newElement);
    if (container.children.length > 0) removeChildren(container);
    container.append(newElement);
    return true;
  };

  const swapBoards = (container, board) => updateContainer(container, board);

  const displayCurrentPlayerName = (playerDisplay, playerName) =>
    updateTextContent(playerDisplay, playerName);

  return {
    updateTextContent,
    updateContainer,
    swapBoards,
    displayCurrentPlayerName
  };
}
