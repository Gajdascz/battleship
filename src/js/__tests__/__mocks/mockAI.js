import createMockPlayer from './mockPlayer';
import { vi } from 'vitest';
export default function createMockAI(difficulty = 1, id = '') {
  // Initialize base properties.
  const ai = createMockPlayer();
  ai.type = 'ai';
  ai.name = 'Computer';
  ai.id = id;
  ai.difficulty = difficulty;
  Object.defineProperty(ai, 'isAI', {
    get: function () {
      return true;
    }
  });

  ai.initializeAvailableMoves = vi.fn();
  ai.initializeFleetTracker = vi.fn();
  ai.setDifficulty = vi.fn((newDifficulty) => (ai.difficulty = newDifficulty));
  ai.setName = vi.fn((newName) => (ai.name = newName));
  ai.placeShips = vi.fn();
  ai.setMockAttack = vi.fn((result, move) => {
    ai.mockAttack = { result, move };
  });

  ai.makeMove = vi.fn(ai.mockAttack);
  ai.initializeLogic = vi.fn(() => true);
  return ai;
}
