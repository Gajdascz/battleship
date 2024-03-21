import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EventManager } from './EventManager'; // Adjust the import path as necessary

describe('EventManager', () => {
  let manager;
  const mockEventName = 'testEvent';
  const mockCallback = vi.fn();

  beforeEach(() => {
    manager = EventManager({
      global: {},
      base: {},
      scopes: []
    });
    vi.resetAllMocks();
  });

  it('should subscribe and emit an event correctly', () => {
    manager.on(mockEventName, mockCallback);
    manager.emit(mockEventName, 'payload');
    expect(mockCallback).toHaveBeenCalledWith({ data: 'payload' });
  });

  it('should unsubscribe from an event correctly', () => {
    manager.on(mockEventName, mockCallback);
    manager.off(mockEventName, mockCallback);
    manager.emit(mockEventName, 'payload');

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should remove all subscriptions correctly', () => {
    const anotherMockCallback = vi.fn();
    manager.on(mockEventName, mockCallback);
    manager.on('anotherEvent', anotherMockCallback);

    manager.offAll();
    manager.emit(mockEventName, 'payload');
    manager.emit('anotherEvent', 'payload');

    expect(mockCallback).not.toHaveBeenCalled();
    expect(anotherMockCallback).not.toHaveBeenCalled();
  });
});
