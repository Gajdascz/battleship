import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EventHandler } from './EventHandler';

describe('EventHandler', () => {
  let emitterMock;
  let eventHandler;
  const eventName = 'testEvent';

  beforeEach(() => {
    emitterMock = {
      publish: vi.fn(),
      subscribe: vi.fn(),
      unsubscribe: vi.fn()
    };
    eventHandler = EventHandler(emitterMock, eventName);
  });

  it('should subscribe to an event correctly', () => {
    const callback = vi.fn();
    eventHandler.on(callback);
    expect(emitterMock.subscribe).toHaveBeenCalledWith(eventName, callback);
    eventHandler.emit('testData');
    expect(emitterMock.publish).toHaveBeenCalledWith(eventName, 'testData');
  });

  it('should unsubscribe from an event correctly', () => {
    const callback = vi.fn();
    eventHandler.on(callback);
    eventHandler.off(callback);
    expect(emitterMock.unsubscribe).toHaveBeenCalledWith(eventName, callback);
  });

  it('should handle pre-emit callback correctly', () => {
    const preEmitCallback = vi.fn((args) => ({ modified: args }));
    eventHandler.setPreEmitCallback(preEmitCallback);

    eventHandler.emit('originalData');
    expect(preEmitCallback).toHaveBeenCalledWith('originalData');
    expect(emitterMock.publish).toHaveBeenCalledWith(eventName, { modified: 'originalData' });
  });

  it('should reset the event handler correctly', () => {
    const callback = vi.fn();
    eventHandler.on(callback);
    eventHandler.reset();
    expect(emitterMock.unsubscribe).toHaveBeenCalledWith(eventName, callback);
    eventHandler.emit('testData');
    expect(callback).not.toHaveBeenCalled();
  });
});
