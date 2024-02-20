import { buildInstructionsDialogElement } from './buildInstructionsDialogElement';

export const InstructionsDialogView = () => {
  const instructionsDialogElement = buildInstructionsDialogElement();

  return {
    setContainer: (container) => container.append(instructionsDialogElement),
    display: () => instructionsDialogElement.showModal(),
    close: () => instructionsDialogElement.close()
  };
};
