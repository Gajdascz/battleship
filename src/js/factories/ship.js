export default function ship(length) {
  const _ship = Array.from({ length }, () => 0);

  const hit = (location) => {
    if (location >= 0 && location < _ship.length) _ship[location] = 1;
  };

  const isSunk = () => _ship.every((loc) => loc === 1);

  const isHitAt = (location) => _ship[location] === 1;

  return { hit, isSunk, isHitAt };
}
