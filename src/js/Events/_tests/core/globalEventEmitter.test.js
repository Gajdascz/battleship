import { describe, it, expect, vi, beforeEach } from 'vitest';
import { globalEmitter } from '../../core/globalEventEmitter';

beforeEach(() => globalEmitter.reset());

describe('globalEmitter subscription management', () => {
  it('should allow subscription to events', () => {
    const callback = vi.fn();
    globalEmitter.subscribe('testEvent', callback);

    expect(globalEmitter.hasEventSubscription('testEvent')).toBe(true);
  });

  it('should allow unsubscribing from events', () => {
    const callback = vi.fn();
    globalEmitter.subscribe('testEvent', callback);
    globalEmitter.unsubscribe('testEvent', callback);
    globalEmitter.publish('testEvent', 'testData');

    expect(callback).not.toHaveBeenCalled();
  });
  describe('globalEmitter multiple subscriptions', () => {
    it('should call all subscribed callbacks when an event is published', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      globalEmitter.subscribe('multiSubscriberEvent', callback1);
      globalEmitter.subscribe('multiSubscriberEvent', callback2);

      globalEmitter.publish('multiSubscriberEvent', { message: 'Broadcast' });

      expect(callback1).toHaveBeenCalledWith({ data: { message: 'Broadcast' } });
      expect(callback2).toHaveBeenCalledWith({ data: { message: 'Broadcast' } });
    });
  });
});
describe('globalEmitter event publishing', () => {
  it('should call subscribed callbacks when an event is published', () => {
    const callback = vi.fn();
    globalEmitter.subscribe('testEvent', callback);
    globalEmitter.publish('testEvent', { message: 'Hello' });

    expect(callback).toHaveBeenCalledWith({ data: { message: 'Hello' } });
  });
});
describe('globalEmitter pending event handling', () => {
  it('should handle pending events upon subscription if the event is pending', () => {
    const callback = vi.fn();
    globalEmitter.publish('pendingEvent', { message: 'Pending' }, true);
    globalEmitter.subscribe('pendingEvent', callback);

    expect(callback).toHaveBeenCalledWith({ data: { message: 'Pending' } });
  });
});
describe('globalEmitter system reset', () => {
  it('should clear all subscriptions and pending events on reset', () => {
    const callback = vi.fn();
    globalEmitter.subscribe('testEvent', callback);
    globalEmitter.reset();

    expect(globalEmitter.hasEventSubscription('testEvent')).toBe(false);
  });
});
describe('globalEmitter fulfillment management', () => {
  it('should add an event to the pending list when published with requireFulfillment', () => {
    const eventData = { message: 'test' };
    globalEmitter.publish('testEvent', eventData, true);

    expect(globalEmitter.isPendingFulfillment('testEvent')).toBe(true);
  });
  it('should process pending events for a subscriber upon subscription', () => {
    const callback = vi.fn();
    const eventData = { message: 'pending' };

    globalEmitter.publish('pendingEvent', eventData, true);
    globalEmitter.subscribe('pendingEvent', callback);

    expect(callback).toHaveBeenCalledWith({ data: eventData });
  });
  it('should remove an event from the pending list once it is fulfilled', () => {
    const eventData = { message: 'fulfill me' };
    globalEmitter.publish('fulfillEvent', eventData, true);
    globalEmitter.publishFulfill('fulfillEvent', eventData, true);

    expect(globalEmitter.isPendingFulfillment('fulfillEvent')).toBe(false);
  });
  it('should notify all subscribers of pending events and then mark the event as fulfilled', () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();
    const eventData = { message: 'multi-subscriber' };

    globalEmitter.publish('multiEvent', eventData, true);

    globalEmitter.subscribe('multiEvent', callback1);
    globalEmitter.subscribe('multiEvent', callback2);

    expect(callback1).toHaveBeenCalledWith({ data: eventData });
    expect(callback2).toHaveBeenCalledWith({ data: eventData });

    expect(globalEmitter.isPendingFulfillment('multiEvent')).toBe(true);
    globalEmitter.publishFulfill('multiEvent');
    expect(globalEmitter.isPendingFulfillment('multiEvent')).toBe(false);
  });
});
