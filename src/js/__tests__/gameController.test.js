import { beforeEach, describe, test, expect } from 'vitest';
import gameController from '../battleship/gameController';
import {
  createMockBoard as board,
  createMockShip as ship,
  createMockPlayer as player,
  createMockAI as computerAI
} from './__mocks__/mockModules.';

describe('Default Initialization', () => {
  let controller;
  beforeEach(() => {
    controller = gameController();
  });
  test.each([
    ['Human player one', () => controller.playerOneName, 'mutinous'],
    ['AI player two', () => controller.playerTwoName, 'Captain CodeSmells'],
    [
      'Switch current player',
      () => {
        controller.switchCurrentPlayer();
        return controller.currentPlayer === controller.playerTwoName;
      },
      true
    ]
  ])('%s', (description, actual, expected) => {
    expect(actual()).toBe(expected);
  });
});
