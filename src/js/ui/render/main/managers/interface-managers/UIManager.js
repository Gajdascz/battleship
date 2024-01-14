import { isHTMLElement, throwError } from '../ManagerUtilities';

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

  return {
    updateTextContent,
    updateContainer
  };
}
