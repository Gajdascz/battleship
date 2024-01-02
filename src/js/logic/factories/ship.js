export default function ship(length, name = null) {
  let _health = length;
  let _name = name;

  const hit = () => {
    if (this.isSunk) return false;
    else {
      _health--;
      return true;
    }
  };

  return {
    hit,
    get isSunk() {
      return _health === 0;
    },
    get isShip() {
      return true;
    },
    ...(_name && {
      get name() {
        return _name;
      }
    }),
    ...(_name && {
      set name(newName) {
        _name = newName;
      }
    })
  };
}
