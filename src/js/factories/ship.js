export default function ship(length) {
  let _health = length;

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
    }
  };
}
