import Chain from '../../logic/ai/advanced-utilities/Chain';
import { vi, describe, expect, test, beforeEach } from 'vitest';

describe('Chain Object', () => {
  let chain;
  beforeEach(() => {
    chain = Chain();
  });
  test('Should initialize with empty queue and null properties', () => {
    expect(chain.getSize()).toBe(0);
    expect(chain.getHead()).toBe(null);
    expect(chain.getTail()).toBe(null);
    expect(chain.getLastFollowedDirection()).toBe(null);
    expect(chain.getOrientation()).toBe(null);
    expect(chain.isEmpty()).toBe(true);
    expect(chain.getSequentialEnds()).toEqual([null, null]);
  });
  test('Should throw error when given invalid coordinates', () => {
    expect(() => addCoordinates([[[5, 5]]])).toThrowError();
  });
  test('Should properly set the first cell in the chain', () => {
    expect(chain.addCoordinates([0, 0])).toBe(true);
    expect(chain.getSize()).toBe(1);
    expect(chain.getHead()).toEqual([0, 0]);
    expect(chain.getTail()).toEqual([0, 0]);
    expect(chain.isEmpty()).toBe(false);
  });
  describe('Chain Initiation', () => {
    test('Should properly initiate horizontal chain when given second pair of coordinates', () => {
      chain.addCoordinates([0, 0]);
      chain.addCoordinates([0, 1]);
      expect(chain.getOrientation()).toBe('horizontal');
    });
    test('Should properly initiate vertical chain when given second pair of coordinates', () => {
      chain.addCoordinates([0, 0]);
      chain.addCoordinates([1, 0]);
      expect(chain.getOrientation()).toBe('vertical');
    });
    test('Should reject and return false when give non-adjacent coordinates', () => {
      chain.addCoordinates([0, 0]);
      expect(chain.addCoordinates([5, 0])).toBe(false);
      expect(chain.getSize()).toBe(1);
      expect(chain.getOrientation()).toBe(null);
    });
  });
  describe('Chain Post Initiation Behavior', () => {
    test('Should properly adjust and return last followed direction', () => {
      chain.addCoordinates([5, 5]);
      chain.addCoordinates([5, 6]);
      expect(chain.getLastFollowedDirection()).toEqual([0, 1]);
      chain.reset();
      chain.addCoordinates([5, 5]);
      chain.addCoordinates([6, 5]);
      expect(chain.getLastFollowedDirection()).toEqual([1, 0]);
      chain.reset();
      chain.addCoordinates([5, 5]);
      chain.addCoordinates([5, 4]);
      expect(chain.getLastFollowedDirection()).toEqual([0, -1]);
      chain.reset();
      chain.addCoordinates([5, 5]);
      chain.addCoordinates([4, 5]);
      expect(chain.getLastFollowedDirection()).toEqual([-1, 0]);
    });
    test('Should properly append directly adjacent coordinates in proper orientation', () => {
      chain.addCoordinates([0, 3]);
      chain.addCoordinates([0, 4]);
      chain.addCoordinates([0, 5]);
      expect(chain.getOrientation()).toBe('horizontal');
      expect(chain.getSize()).toBe(3);
      const chain2 = Chain();
      chain2.addCoordinates([3, 0]);
      chain2.addCoordinates([4, 0]);
      chain2.addCoordinates([5, 0]);
      expect(chain2.getOrientation()).toBe('vertical');
      expect(chain2.getSize()).toBe(3);
    });
    test('Should properly append adjacent coordinates to chain ends in proper orientation', () => {
      chain.addCoordinates([0, 3]);
      chain.addCoordinates([0, 4]);
      chain.addCoordinates([0, 5]);
      chain.addCoordinates([0, 2]);
      chain.addCoordinates([0, 6]);

      expect(chain.getOrientation()).toBe('horizontal');
      expect(chain.getSize()).toBe(5);
      expect(chain.getSequentialEnds()[0]).toEqual([0, 2]);
      expect(chain.getSequentialEnds()[1]).toEqual([0, 6]);

      const chain2 = Chain();
      chain2.addCoordinates([3, 0]);
      chain2.addCoordinates([4, 0]);
      chain2.addCoordinates([5, 0]);
      chain2.addCoordinates([2, 0]);
      chain2.addCoordinates([6, 0]);
      expect(chain2.getOrientation()).toBe('vertical');
      expect(chain2.getSize()).toBe(5);
      expect(chain2.getSequentialEnds()[0]).toEqual([2, 0]);
      expect(chain2.getSequentialEnds()[1]).toEqual([6, 0]);
    });
    test('Should destruct to return arrays', () => {
      const chronological = [
        [0, 4],
        [0, 5],
        [0, 6],
        [0, 3],
        [0, 2],
        [0, 1],
        [0, 7]
      ];
      chain.addCoordinates([0, 4]);
      chain.addCoordinates([0, 5]);
      chain.addCoordinates([0, 6]);
      chain.addCoordinates([0, 3]);
      chain.addCoordinates([0, 2]);
      chain.addCoordinates([0, 1]);
      chain.addCoordinates([0, 7]);
      const results = chain.destruct();
      expect(results.orientation).toBe('horizontal');
      expect(results.hits).toEqual(chronological);
      expect(chain.getOrientation()).toBe(null);
    });
  });
});
