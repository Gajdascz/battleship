const Node = ({ data, next = null }) => {
  const _data = data;
  let _next = next;
  return {
    get data() {
      return _data;
    },
    get next() {
      return _next;
    },
    set next(nextNode) {
      _next = nextNode;
    }
  };
};

export default function Queue() {
  let _head = null;
  let _tail = null;
  let _size = 0;

  const enqueue = (data) => {
    const node = Node({ data });
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
    const output = _head.data;
    _head = _head.next;
    if (_size === 1) _tail = null;
    _size--;
    return output;
  };

  const peekHead = () => _head?.data.slice() ?? null;
  const peekTail = () => _tail?.data.slice() ?? null;

  const isEmpty = () => _size === 0;
  const size = () => _size;

  return {
    enqueue,
    dequeue,
    peekHead,
    peekTail,
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
