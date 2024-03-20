import { describe, expect, it, beforeEach } from 'vitest';
import { HitsManager } from './HitsManager';

describe('HitsManager', () => {
  let manager;

  beforeEach(() => {
    manager = HitsManager();
  });

  it('should start with zero total hits and sunk', () => {
    expect(manager.getHits()).toBe(0);
    expect(manager.getSunk()).toBe(0);
  });

  it('should add and retrieve unresolved hits correctly', () => {
    manager.addUnresolvedHit([1, 1]);
    manager.addUnresolvedHit([2, 2]);
    expect(manager.getUnresolvedHits()).toEqual([
      [1, 1],
      [2, 2]
    ]);
  });

  it('should resolve hits correctly', () => {
    manager.addUnresolvedHit([1, 1]);
    manager.resolveHit([1, 1]);
    expect(manager.isHitResolved([1, 1])).toBe(true);
    expect(manager.getUnresolvedHits()).toEqual([]);
    expect(manager.getResolvedHits()).toEqual([[1, 1]]);
  });

  it('should handle last hit correctly', () => {
    manager.setLastHit([3, 3]);
    expect(manager.getLastHit()).toEqual([3, 3]);
  });

  it('should count total hits and sunk correctly', () => {
    manager.addHit();
    manager.addHit();
    manager.addSunk(2);
    expect(manager.getHits()).toBe(2);
    expect(manager.getSunk()).toBe(2);
    expect(manager.areHitsEqualToSunk()).toBe(true);
  });

  it('should resolve all unresolved hits', () => {
    manager.addUnresolvedHit([1, 1]);
    manager.addUnresolvedHit([2, 2]);
    manager.resolveAllUnresolved();
    expect(manager.getUnresolvedHits()).toEqual([]);
    expect(manager.getResolvedHits()).toEqual([
      [1, 1],
      [2, 2]
    ]);
  });

  it('should not add duplicate unresolved hits', () => {
    manager.addUnresolvedHit([1, 1]);
    manager.addUnresolvedHit([1, 1]);
    expect(manager.getUnresolvedHits()).toEqual([[1, 1]]);
  });

  it('should not resolve non-existent hits', () => {
    manager.addUnresolvedHit([1, 1]);
    manager.resolveHit([2, 2]);
    expect(manager.isHitResolved([2, 2])).toBe(false);
    expect(manager.getUnresolvedHits()).toEqual([[1, 1]]);
    expect(manager.getResolvedHits()).toEqual([]);
  });

  it('should correctly identify if there are unresolved hits', () => {
    expect(manager.hasUnresolvedHits()).toBe(false);
    manager.addUnresolvedHit([1, 1]);
    expect(manager.hasUnresolvedHits()).toBe(true);
    manager.resolveHit([1, 1]);
    expect(manager.hasUnresolvedHits()).toBe(false);
  });

  it('should correctly add and retrieve the last hit', () => {
    expect(manager.getLastHit()).toBeNull();
    manager.setLastHit([4, 4]);
    expect(manager.getLastHit()).toEqual([4, 4]);
  });

  it('should correctly increment total hits and sunk separately', () => {
    manager.addHit();
    manager.addSunk(1);
    expect(manager.getHits()).toBe(1);
    expect(manager.getSunk()).toBe(1);
    manager.addHit();
    expect(manager.getHits()).toBe(2);
    expect(manager.getSunk()).toBe(1);
  });
  it('should not add invalid hits (non-array or incorrect structure)', () => {
    manager.resolveHit('invalid');
    manager.resolveHit([1]);
    manager.resolveHit([1, 'a']);
    manager.resolveHit([1, 2, 3]);
    manager.resolveHit(null);
    expect(manager.getUnresolvedHits()).toEqual([]);
  });

  it('should not resolve invalid hits (non-array or incorrect structure)', () => {
    manager.resolveHit('invalid');
    manager.resolveHit(null);
    manager.addUnresolvedHit([1, 1]);
    manager.resolveHit([1]);
    manager.resolveHit([1, 'a']);
    manager.resolveHit([1, 2, 3]);

    expect(manager.getResolvedHits()).toEqual([]);
    expect(manager.getUnresolvedHits()).toEqual([[1, 1]]);
  });

  it('should maintain state consistency after multiple operations', () => {
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

  it('should handle large numbers for hits', () => {
    const largeHit = [99999, 99999];
    manager.addUnresolvedHit(largeHit);
    expect(manager.getUnresolvedHits()).toEqual([largeHit]);
    manager.resolveHit(largeHit);
    expect(manager.getResolvedHits()).toEqual([largeHit]);
  });
});
