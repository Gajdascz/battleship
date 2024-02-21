import { buildElementFromUIObj } from '../../../../utility/uiBuilderUtils/uiBuilders';
import { InstructionsManager } from './InstructionsManager';
import { placementInstructionsConfig } from '../configurations/placementInstructionsConfig';
import { combatInstructionsConfig } from '../configurations/combatInstructionsConfig';
import { settingsInstructionsConfig } from '../configurations/settingsInstructionsConfig';
export const buildInstructionsElements = () => {
  const instructionsManager = InstructionsManager();
  instructionsManager.loadInstructionsConfig(placementInstructionsConfig);
  instructionsManager.loadInstructionsConfig(combatInstructionsConfig);
  instructionsManager.loadInstructionsConfig(settingsInstructionsConfig);

  return {
    placement: buildElementFromUIObj(instructionsManager.buildInstruction('placementInstructions')),
    combat: buildElementFromUIObj(instructionsManager.buildInstruction('combatInstructions')),
    settings: buildElementFromUIObj(instructionsManager.buildInstruction('settingsInstructions'))
  };
};
