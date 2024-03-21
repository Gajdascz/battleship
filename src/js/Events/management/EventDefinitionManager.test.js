import { describe, it, expect, beforeEach } from 'vitest';
import { EventDefinitionManager } from './EventDefinitionManager';

const scopes = {
  LOREM: 'lorem'
};
const base = {
  IPSUM: 'ipsum'
};
const baseTypes = {
  IPSUM: 'IPSUM'
};
const global = {
  DOLOR: 'dolor'
};

describe('EventDefinitionManager', () => {
  let manager;

  beforeEach(() => {
    manager = EventDefinitionManager();
  });

  it('should initialize with empty events', () => {
    expect(manager.getGlobalEvents()).toEqual({});
    expect(manager.getBaseEvents()).toEqual({});
    expect(manager.getScopedEvents()).toEqual({});
  });

  it('should add and remove scopes correctly', () => {
    manager.addScope(scopes.LOREM);
    expect(manager.getScopedEvents()).toHaveProperty(scopes.LOREM);
    manager.removeScope(scopes.LOREM);
    expect(manager.getScopedEvents()).not.toHaveProperty(scopes.LOREM);
  });

  it('should set base events and generates baseTypes', () => {
    manager.setBaseEvents({ [baseTypes.IPSUM]: { ipsum: base.IPSUM } });
    expect(manager.getBaseEvents()).toEqual({ [baseTypes.IPSUM]: { ipsum: base.IPSUM } });
    expect(manager.getBaseTypes()).toHaveProperty(baseTypes.IPSUM);
  });

  it('should generate scoped events from base events', () => {
    manager.setBaseEvents({ ipsum: base.IPSUM });
    manager.addScope(scopes.LOREM);
    const scopedEvents = manager.getScopedEvents();
    expect(scopedEvents[scopes.LOREM]).toHaveProperty(
      base.IPSUM,
      `${scopes.LOREM + '@' + base.IPSUM}`
    );
  });

  it('should set global events', () => {
    const globalEvents = { dolor: global.DOLOR };
    manager.setGlobalEvents(globalEvents);
    expect(manager.getGlobalEvents()).toEqual(globalEvents);
  });

  it('should reset all events and scopes', () => {
    manager.setGlobalEvents({ dolor: global.DOLOR });
    manager.setBaseEvents({ [baseTypes.IPSUM]: base.IPSUM });
    manager.addScope(scopes.LOREM);
    manager.reset();
    expect(manager.getGlobalEvents()).toEqual({});
    expect(manager.getBaseEvents()).toEqual({});
    expect(manager.getScopedEvents()).toEqual({});
    expect(manager.getBaseTypes()).toEqual({});
  });
});
