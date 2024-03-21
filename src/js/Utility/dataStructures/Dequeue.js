const Node = ({ data, next = null, prev = null }) => {
  const _data = data;
  let _next = next;
  let _prev = prev;
  return {
    get data() {
      return _data;
    },
    get next() {
      return _next;
    },
    set next(nextNode) {
      _next = nextNode;
    },
    get prev() {
      return _prev;
    },
    set prev(prevNode) {
      _prev = prevNode;
    }
  };
};

export default function Dequeue() {
  let _head = null;
  let _tail = null;
  let _size = 0;

  const pushFront = (data) => {
    const node = Node({ data });
    if (_size === 0) {
      _head = node;
      _tail = node;
    } else {
      node.next = _head;
      _head.prev = node;
      _head = node;
    }
    _size++;
  };

  const pushBack = (data) => {
    const node = Node({ data });
    if (_size === 0) {
      _head = node;
      _tail = node;
    } else {
      node.prev = _tail;
      _tail.next = node;
      _tail = node;
    }
    _size++;
  };

  const popFront = () => {
    if (_size === 0) return undefined;
    const output = _head.data;
    _head = _head.next;
    if (_size === 1) _tail = null;
    else _head.prev = null;
    _size--;
    return output;
  };

  const popBack = () => {
    if (_size === 0) return undefined;
    const output = _tail.data;
    _tail = _tail.prev;
    if (_size === 1) _head = null;
    else _tail.next = null;
    _size--;
    return output;
  };

  const peekHead = () => _head?.data.slice() ?? null;
  const peekTail = () => _tail?.data.slice() ?? null;
  const peekBeforeTail = () => _tail?.prev?.data.slice() ?? null;
  const isEmpty = () => _size === 0;
  const size = () => _size;

  return {
    pushFront,
    pushBack,
    popFront,
    popBack,
    peekHead,
    peekTail,
    peekBeforeTail,
    isEmpty,
    size,
    copyToArray: () => {
      if (!_head) return [];
      let currentNode = _head;
      const array = [];
      while (currentNode !== null) {
        array.push(currentNode.data.slice());
        currentNode = currentNode.next;
      }
      return array;
    }
  };
}
