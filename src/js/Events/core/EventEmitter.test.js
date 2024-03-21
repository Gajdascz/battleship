import { vi, describe, it, expect, beforeEach } from 'vitest';
import { EventEmitter } from './EventEmitter';

describe('EventEmitter', () => {
  let eventEmitter;

  beforeEach(() => {
    eventEmitter = EventEmitter();
  });

  it('should allow subscribing to events and publishes data to them', () => {
    const callback = vi.fn();
    eventEmitter.subscribe('testEvent', callback);
    eventEmitter.publish('testEvent', 'testData');

    expect(callback).toHaveBeenCalledWith({ data: 'testData' });
  });

  it('should allow unsubscribing from events', () => {
    const callback = vi.fn();
    eventEmitter.subscribe('testEvent', callback);
    eventEmitter.unsubscribe('testEvent', callback);
    eventEmitter.publish('testEvent', 'testData');

    expect(callback).not.toHaveBeenCalled();
  });

  it('should not call callbacks for unsubscribed events', () => {
    const callback = vi.fn();
    eventEmitter.subscribe('testEvent', callback);
    eventEmitter.unsubscribe('testEvent', callback);
    eventEmitter.publish('testEvent', 'testData');

    expect(callback).toHaveBeenCalledTimes(0);
  });

  it('should reset all event subscriptions', () => {
    const callback = vi.fn();
    eventEmitter.subscribe('testEvent', callback);
    eventEmitter.reset();
    eventEmitter.publish('testEvent', 'testData');

    expect(callback).not.toHaveBeenCalled();
  });
});
