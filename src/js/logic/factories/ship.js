export default function ship(length, name = null) {
  const setID = () => (name ? name.toLowerCase().replace(' ', '-') : null);
  const _length = length;
  let _health = length;
  let _name = name;
  let _id = setID();
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
      setID();
    },
    get health() {
      return _health;
    },
    get length() {
      return _length;
    },
    get id() {
      return _id;
    },
    reset: () => (_health = _length)
  };
}
