export default function ship(length, name = null) {
  let _health = length;
  let _name = name;

  return {
    hit() {
      if (this.isSunk) return false;
      else _health--;
      return true;
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
    },
    get health() {
      return _health;
    }
  };
}
