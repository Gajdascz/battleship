import { beforeEach, describe, test, expect, vi, afterEach } from 'vitest';
import mockInitializeGameObjects from '../../../__mocks/mockInitializeGameObjects';

import createMockShip from '../../../__mocks/mockShip';

import initiateGameController from '../../../../logic/game/initialization/initiateGameController';

vi.mock('../../../../logic/game/initialization/initializeGameObjects.js', () => ({
  default: mockInitializeGameObjects
}));

const p1Info = { type: 'human', name: 'Player' };
const p2Info = { type: 'ai', name: 'Computer', difficulty: 0 };
const boardOptions = { rows: 10, cols: 10, letterAxis: 'row' };

let mockDocument;
let dispatchedEvents;
beforeEach(() => {
  dispatchedEvents = [];
  mockDocument = { dispatchEvent: vi.fn((event) => dispatchedEvents.push(event)) };
  global.document = mockDocument;
  initiateGameController({
    playerOneInformation: p1Info,
    playerTwoInformation: p2Info,
    boardOptions
  });
});
afterEach(() => {
  vi.restoreAllMocks();
});

const extractCallback = (stateName) => {
  const eventObj = dispatchedEvents.find((event) => event.type === stateName);
  return eventObj.detail.callback;
};

const extractDetail = (stateName) => {
  const eventObj = dispatchedEvents.find((event) => event.type === stateName);
  return eventObj.detail;
};

const getP1 = () => extractDetail('gameStarted').playerOne;

const placementHelper = () => {
  const reinitializeFleet = (player) => {
    const fleet = [
      createMockShip(1, 'shipA'),
      createMockShip(1, 'shipB'),
      createMockShip(1, 'shipC')
    ];
    player.clearFleet();
    player.addShip(fleet);
  };

  const playerPlacementEventDetail = (player) => {
    const placements = new Map();
    player.fleet.forEach((ship, index) => {
      placements.set(ship.id, { start: [0, index], end: [0, index] });
    });
    return { detail: { placements } };
  };

  const placeAIFleet = (ai) => {
    ai.fleet.forEach((ship, index) => ai.board.place({ ship, start: [0, index], end: [0, index] }));
  };

  return { reinitializeFleet, playerPlacementEventDetail, placeAIFleet };
};
const submitPlacements = () => {
  const initDetail = extractDetail('gameStarted');
  const onPlacementSubmission = extractCallback('gamePlacementState');
  const helper = placementHelper();
  const p1 = initDetail.playerOne;
  const p2 = initDetail.playerTwo;
  helper.reinitializeFleet(p1);
  helper.reinitializeFleet(p2);
  helper.placeAIFleet(p2);
  const placementDetails = helper.playerPlacementEventDetail(p1);
  onPlacementSubmission(placementDetails);
};

const sendMockAttack = (coordinates = [9, 9]) => {
  const onPlayerAttack = extractCallback('gameInProgressState');
  const mockPlayerAttackEvent = (coordinates) => ({ detail: { coordinates } });
  onPlayerAttack(mockPlayerAttackEvent(coordinates));
};

const gameStartedEventDetail = {
  gameMode: expect.anything(),
  boardOptions: expect.anything(),
  playerOne: expect.anything(),
  playerTwo: expect.anything(),
  currentPlayer: expect.anything(),
  waitingPlayer: expect.anything()
};

const assertTransitionDispatch = () => {
  expectDispatch('stateTransitioned', expect.objectContaining({ state: expect.anything() }));
};

const assertPlayerSwitchDispatch = () => expectDispatch('playerSwitched');

const expectDispatch = (type, detail = null) => {
  expect(mockDocument.dispatchEvent).toHaveBeenCalledWith(
    expect.objectContaining({
      type,
      ...(detail && { detail })
    })
  );
};

const callbackDetail = { callback: expect.any(Function) };

describe('initiateGameController', () => {
  describe('Initialization', () => {
    test('Should use initializer to set up all necessary objects', () => {
      expect(mockInitializeGameObjects).toHaveBeenCalledWith(p1Info, p2Info, boardOptions);
    });
  });
  describe('Event Dispatching', () => {
    test('Should dispatch game started event on initialization', () => {
      assertTransitionDispatch();
      expectDispatch('gameStarted', gameStartedEventDetail);
    });

    test('Should dispatch game placement event post initialization', () => {
      assertTransitionDispatch();
      expectDispatch('gamePlacementState', callbackDetail);
    });

    test('Should dispatch game in progress event post placement', () => {
      assertTransitionDispatch();

      submitPlacements();
      assertPlayerSwitchDispatch();
      expectDispatch('gameInProgressState', callbackDetail);
    });
    test('Should dispatch attack processed event post attack', () => {
      submitPlacements();
      sendMockAttack();
      assertPlayerSwitchDispatch();
      expectDispatch('attackProcessed', expect.anything());
    });
    test('Should dispatch game over event when all of a players ships are sunk', () => {
      submitPlacements();
      const p1 = getP1();
      p1.sinkFleet();
      sendMockAttack([0, 0]);
      assertPlayerSwitchDispatch();
      assertTransitionDispatch();
      expectDispatch('gameOverState', expect.anything());
    });
  });
});
