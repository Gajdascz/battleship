import { GameCoordinator } from './GameCoordinator';
import { createEventKeyGenerator } from '../../../Utility/utils/createEventKeyGenerator';

export const PlayerGameCoordinators = (emitter, p1Id, p2Id) => {
  const getEmitterBundles = (emitter, p1Id, p2Id) => ({
    [p1Id]: {
      emitter,
      getPlayerEventKey: createEventKeyGenerator(p1Id),
      getOpponentEventKey: createEventKeyGenerator(p2Id)
    },
    [p2Id]: {
      emitter,
      getPlayerEventKey: createEventKeyGenerator(p2Id),
      getOpponentEventKey: createEventKeyGenerator(p1Id)
    }
  });
  const emitterBundles = getEmitterBundles(emitter, p1Id, p2Id);
  return {
    [p1Id]: GameCoordinator(emitterBundles[p1Id]),
    [p2Id]: GameCoordinator(emitterBundles[p2Id])
  };
};
