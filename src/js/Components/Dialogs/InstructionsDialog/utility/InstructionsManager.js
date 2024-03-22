import {
  buildParagraphObj,
  buildSpanObj,
  wrap
} from '../../../../Utility/uiBuilderUtils/uiBuilders';
import { BASE_DIALOG_CLASSES } from '../../common/dialogClassConstants';

const COMMON = {
  primary: {
    containerClass: 'instructions-content-container',
    headerClass: `${BASE_DIALOG_CLASSES.HEADER_PRIMARY} ${BASE_DIALOG_CLASSES.GREEN_UNDERLINE}`
  },
  sections: {
    containerClass: 'instructions-section-container',
    headerClass: `${BASE_DIALOG_CLASSES.HEADER_SECONDARY} ${BASE_DIALOG_CLASSES.GREEN_UNDERLINE}`,
    instructionListItemClass: 'instruction-list-item',
    instructionTextClass: 'color-white'
  }
};
/**
 * Manages the creation and assembly of instructions. Provides a flexible structure
 * allowing dynamic construction content based on configured templates.
 *
 * @returns {Object} Interface to manage instructions.
 */
export const InstructionsManager = () => {
  const markers = {
    bullet: '•',
    numeric: (index) => `${index + 1}.`
  };
  const instructions = new Map();

  const addInstruction = (instructionName, instructionHeaderText, sections) => {
    instructions.set(instructionName, { instructionHeaderText, sections });
  };

  const buildListItemObj = (marker, text) => {
    const paragraph = buildParagraphObj(marker, COMMON.sections.instructionListItemClass);
    const textSpan = buildSpanObj(text, COMMON.sections.instructionTextClass);
    paragraph.children = [textSpan];
    return paragraph;
  };

  const buildSectionInstructions = (section) => {
    const { sectionHeaderText, instructions: sectionInstructions, markerType } = section;
    const instructionsHeader = buildParagraphObj(sectionHeaderText, COMMON.sections.headerClass);
    const builtInstructions = sectionInstructions.map((instruction, index) => {
      const marker = markerType === 'numeric' ? markers.numeric(index) : markers.bullet;
      return buildListItemObj(marker, instruction);
    });
    return wrap(COMMON.sections.containerClass, [instructionsHeader, ...builtInstructions]);
  };

  const loadInstructionsConfig = (config) => {
    const { instructionName, instructionHeaderText, sections } = config;
    addInstruction(instructionName, instructionHeaderText, sections);
  };

  const buildInstruction = (instructionName) => {
    const instructionConfig = instructions.get(instructionName);
    if (!instructionConfig) {
      console.error('Instruction name not found:', instructionName);
      return null;
    }
    const { instructionHeaderText, sections } = instructionConfig;
    const instructionElements = sections.map(buildSectionInstructions);
    return wrap(COMMON.primary.containerClass, [
      buildParagraphObj(instructionHeaderText, COMMON.primary.headerClass),
      ...instructionElements
    ]);
  };

  return {
    loadInstructionsConfig,
    buildInstruction
  };
};
