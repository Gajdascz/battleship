const Node = ({ hitCoordinates, next = null }) => {
  const _coordinates = hitCoordinates;
  let _next = next;
  return {
    get coordinates() {
      return _coordinates;
    },
    get next() {
      return _next;
    },
    set next(nextNode) {
      _next = nextNode;
    }
  };
};
export default function queue() {
  let _head = null;
  let _tail = null;
  let _size = 0;

  const enqueue = (coordinates) => {
    const node = Node({ hitCoordinates: coordinates });
    if (_size === 0) {
      _head = node;
      _tail = node;
    } else {
      _tail.next = node;
      _tail = node;
    }
    _size++;
  };

  const dequeue = () => {
    if (_size === 0) return undefined;
    const output = _head.coordinates;
    _head = _head.next;
    if (_size === 1) _tail = null;
    _size--;
    return output;
  };

  return {
    enqueue,
    dequeue,
    get peek() {
      return _head?.coordinates;
    },
    get isEmpty() {
      return _size === 0;
    },
    get size() {
      return _size;
    }
  };
}
