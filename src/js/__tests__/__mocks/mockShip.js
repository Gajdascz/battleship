import { vi } from 'vitest';

export default function createMockShip(length = 5, name = null) {
  const setID = () => (name ? name.toLowerCase().replace(' ', '-') : null);
  let _length = length;
  let _name = name;
  let _id = setID();
  let _health = length;
  return {
    hit: vi.fn().mockImplementation(function () {
      if (this.isSunk) return false;
      return _health-- && true;
    }),
    get health() {
      return _health;
    },
    get isSunk() {
      return _health === 0;
    },
    get isShip() {
      return true;
    },
    get name() {
      return _name;
    },
    set name(newName) {
      _name = newName;
      _id = setID();
    },
    get id() {
      return _id;
    },
    get length() {
      return _length;
    },
    reset: () => (_health = _length),
    toggleSunk: vi.fn().mockImplementation(function () {
      _health -= _health;
    }),
    setHealth: vi.fn().mockImplementation(function (health) {
      _health = health;
    }),
    setLength: vi.fn().mockImplementation(function (length) {
      _length = length;
    })
  };
}
