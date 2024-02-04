import { describe, expect, test, beforeEach } from 'vitest';
import { HitsManager } from '../../../logic/ai/advancedAI/HitsManager';

describe('HitsManager', () => {
  let manager;

  beforeEach(() => {
    manager = HitsManager();
  });

  test('should start with zero total hits and sunk', () => {
    expect(manager.getHits()).toBe(0);
    expect(manager.getSunk()).toBe(0);
  });

  test('should add and retrieve unresolved hits correctly', () => {
    manager.addUnresolvedHit([1, 1]);
    manager.addUnresolvedHit([2, 2]);
    expect(manager.getUnresolvedHits()).toEqual([
      [1, 1],
      [2, 2]
    ]);
  });

  test('should resolve hits correctly', () => {
    manager.addUnresolvedHit([1, 1]);
    manager.resolveHit([1, 1]);
    expect(manager.isHitResolved([1, 1])).toBe(true);
    expect(manager.getUnresolvedHits()).toEqual([]);
    expect(manager.getResolvedHits()).toEqual([[1, 1]]);
  });

  test('should handle last hit correctly', () => {
    manager.setLastHit([3, 3]);
    expect(manager.getLastHit()).toEqual([3, 3]);
  });

  test('should count total hits and sunk correctly', () => {
    manager.addHit();
    manager.addHit();
    manager.addSunk(2);
    expect(manager.getHits()).toBe(2);
    expect(manager.getSunk()).toBe(2);
    expect(manager.areHitsEqualToSunk()).toBe(true);
  });

  test('should resolve all unresolved hits', () => {
    manager.addUnresolvedHit([1, 1]);
    manager.addUnresolvedHit([2, 2]);
    manager.resolveAllUnresolved();
    expect(manager.getUnresolvedHits()).toEqual([]);
    expect(manager.getResolvedHits()).toEqual([
      [1, 1],
      [2, 2]
    ]);
  });

  test('should not add duplicate unresolved hits', () => {
    manager.addUnresolvedHit([1, 1]);
    manager.addUnresolvedHit([1, 1]);
    expect(manager.getUnresolvedHits()).toEqual([[1, 1]]);
  });

  test('should not resolve non-existent hits', () => {
    manager.addUnresolvedHit([1, 1]);
    manager.resolveHit([2, 2]);
    expect(manager.isHitResolved([2, 2])).toBe(false);
    expect(manager.getUnresolvedHits()).toEqual([[1, 1]]);
    expect(manager.getResolvedHits()).toEqual([]);
  });

  test('should correctly identify if there are unresolved hits', () => {
    expect(manager.hasUnresolvedHits()).toBe(false);
    manager.addUnresolvedHit([1, 1]);
    expect(manager.hasUnresolvedHits()).toBe(true);
    manager.resolveHit([1, 1]);
    expect(manager.hasUnresolvedHits()).toBe(false);
  });

  test('should correctly add and retrieve the last hit', () => {
    expect(manager.getLastHit()).toBeNull();
    manager.setLastHit([4, 4]);
    expect(manager.getLastHit()).toEqual([4, 4]);
  });

  test('should correctly increment total hits and sunk separately', () => {
    manager.addHit();
    manager.addSunk(1);
    expect(manager.getHits()).toBe(1);
    expect(manager.getSunk()).toBe(1);
    manager.addHit();
    expect(manager.getHits()).toBe(2);
    expect(manager.getSunk()).toBe(1);
  });
  test('should not add invalid hits (non-array or incorrect structure)', () => {
    manager.resolveHit('invalid');
    manager.resolveHit([1]);
    manager.resolveHit([1, 'a']);
    manager.resolveHit([1, 2, 3]);
    manager.resolveHit(null);
    expect(manager.getUnresolvedHits()).toEqual([]);
  });

  test('should not resolve invalid hits (non-array or incorrect structure)', () => {
    manager.resolveHit('invalid');
    manager.resolveHit(null);
    manager.addUnresolvedHit([1, 1]);
    manager.resolveHit([1]);
    manager.resolveHit([1, 'a']);
    manager.resolveHit([1, 2, 3]);

    expect(manager.getResolvedHits()).toEqual([]);
    expect(manager.getUnresolvedHits()).toEqual([[1, 1]]);
  });

  test('should maintain state consistency after multiple operations', () => {
    manager.addHit();
    manager.addUnresolvedHit([1, 1]);
    manager.resolveHit([1, 1]);
    manager.addUnresolvedHit([2, 2]);
    manager.addSunk(1);
    expect(manager.getHits()).toBe(1);
    expect(manager.getSunk()).toBe(1);
    expect(manager.getUnresolvedHits()).toEqual([[2, 2]]);
    expect(manager.getResolvedHits()).toEqual([[1, 1]]);
  });

  test('should handle large numbers for hits', () => {
    const largeHit = [99999, 99999];
    manager.addUnresolvedHit(largeHit);
    expect(manager.getUnresolvedHits()).toEqual([largeHit]);
    manager.resolveHit(largeHit);
    expect(manager.getResolvedHits()).toEqual([largeHit]);
  });
});
