import { describe, expect, it, beforeEach } from 'vitest';
import Chain from './Chain';

describe('Chain Object', () => {
  let chain;
  beforeEach(() => {
    chain = Chain();
  });
  it('Should initialize with empty queue and null properties', () => {
    expect(chain.size()).toBe(0);
    expect(chain.peekHead()).toBe(null);
    expect(chain.peekTail()).toBe(null);
    expect(chain.getCurrentDirection()).toBe(null);
    expect(chain.getAfterHeadDirection()).toBe(null);
    expect(chain.getAfterTailDirection()).toBe(null);
    expect(chain.getOrientation()).toBe(null);
    expect(chain.isEmpty()).toBe(true);
    expect(chain.isInitialized()).toBe(false);
    expect(chain.reset).toBeDefined();
    expect(chain.copyChainToArray()).toEqual([]);
    expect(chain.popHead()).toBeUndefined();
    expect(chain.popTail()).toBeUndefined();
    expect(chain.addCoordinates).toBeDefined();
  });
  it('Should catch error when given invalid coordinates and prevent reject adding the coordinates', () => {
    chain.addCoordinates([[[5, 5]]]);
    expect(chain.size()).toEqual(0);
  });
  it('Should properly set the first cell in the chain', () => {
    expect(chain.addCoordinates([0, 0])).toBe(true);
    expect(chain.size()).toBe(1);
    expect(chain.peekHead()).toEqual([0, 0]);
    expect(chain.peekTail()).toEqual([0, 0]);
    expect(chain.isEmpty()).toBe(false);
  });
  it('Should initialize correctly given parameters', () => {
    const newChain = Chain({ coordinates: [5, 5], startingOrientation: 'vertical' });
    expect(newChain.getOrientation()).toEqual('vertical');
    expect(newChain.peekHead()).toEqual([5, 5]);
    expect(newChain.isInitialized()).toBe(true);
  });
  describe('Chain Initiation', () => {
    it('Should properly initiate horizontal chain when given second pair of coordinates', () => {
      chain.addCoordinates([0, 0]);
      chain.addCoordinates([0, 1]);
      expect(chain.getOrientation()).toBe('horizontal');
    });
    it('Should properly initiate vertical chain when given second pair of coordinates', () => {
      chain.addCoordinates([0, 0]);
      chain.addCoordinates([1, 0]);
      expect(chain.getOrientation()).toBe('vertical');
    });
    it('Should reject and return false when give non-adjacent coordinates', () => {
      chain.addCoordinates([0, 0]);
      expect(chain.addCoordinates([5, 0])).toBe(false);
      expect(chain.size()).toBe(1);
      expect(chain.getOrientation()).toBe(null);
    });
  });
  describe('Chain Post Initiation Behavior', () => {
    it('Should properly adjust and return the current direction', () => {
      chain.addCoordinates([5, 5]);
      chain.addCoordinates([5, 6]);
      expect(chain.getCurrentDirection()).toEqual([0, 1]);
      chain.reset();
      chain.addCoordinates([5, 5]);
      chain.addCoordinates([6, 5]);
      expect(chain.getCurrentDirection()).toEqual([1, 0]);
      chain.reset();
      chain.addCoordinates([5, 5]);
      chain.addCoordinates([5, 4]);
      expect(chain.getCurrentDirection()).toEqual([0, -1]);
      chain.reset();
      chain.addCoordinates([5, 5]);
      chain.addCoordinates([4, 5]);
      expect(chain.getCurrentDirection()).toEqual([-1, 0]);
    });
    it('Should initialize afterHead and afterTail directions correctly', () => {
      chain.addCoordinates([5, 5]);
      chain.addCoordinates([5, 6]);
      expect(chain.getOrientation()).toEqual('horizontal');
      expect(chain.getAfterHeadDirection()).toEqual([-0, -1]);
      expect(chain.getAfterTailDirection()).toEqual([0, 1]);
    });
    it('Should properly append directly adjacent coordinates in proper orientation', () => {
      chain.addCoordinates([0, 3]);
      chain.addCoordinates([0, 4]);
      chain.addCoordinates([0, 5]);
      expect(chain.getOrientation()).toBe('horizontal');
      expect(chain.size()).toBe(3);
      expect(chain.peekHead()).toEqual([0, 3]);
      expect(chain.peekTail()).toEqual([0, 5]);

      chain.reset();
      chain.addCoordinates([3, 0]);
      chain.addCoordinates([4, 0]);
      chain.addCoordinates([5, 0]);
      expect(chain.getOrientation()).toBe('vertical');
      expect(chain.size()).toBe(3);
    });
    it('Should copy and return the Chain nodes as an array.', () => {
      chain.addCoordinates([3, 0]);
      chain.addCoordinates([4, 0]);
      chain.addCoordinates([5, 0]);
      expect(chain.copyChainToArray()).toEqual([
        [3, 0],
        [4, 0],
        [5, 0]
      ]);
    });
    it('Should pop from head and tail of chain', () => {
      chain.addCoordinates([0, 0]);
      chain.addCoordinates([1, 0]);
      chain.addCoordinates([2, 0]);
      chain.addCoordinates([3, 0]);
      chain.addCoordinates([4, 0]);
      chain.addCoordinates([5, 0]);
      expect(chain.popHead()).toEqual([0, 0]);
      expect(chain.popTail()).toEqual([5, 0]);
      expect(chain.size()).toEqual(4);
    });
  });
});
