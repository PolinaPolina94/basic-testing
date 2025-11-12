import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  // Check match by expect(...).toStrictEqual(...)
  test('should generate linked list from values 1', () => {
    const values = [1, 2, 3];
    const expected = {
      value: 1,
      next: {
        value: 2,
        next: {
          value: 3,
          next: {
            value: null,
            next: null,
          },
        },
      },
    };

    const result = generateLinkedList(values);
    expect(result).toStrictEqual(expected);
  });

  test('should generate linked list with string values', () => {
    const values = ['a', 'b', 'c'];
    const expected = {
      value: 'a',
      next: {
        value: 'b',
        next: {
          value: 'c',
          next: {
            value: null,
            next: null,
          },
        },
      },
    };

    const result = generateLinkedList(values);
    expect(result).toStrictEqual(expected);
  });

  test('should generate empty linked list for empty array', () => {
    const values: number[] = [];
    const expected = {
      value: null,
      next: null,
    };

    const result = generateLinkedList(values);
    expect(result).toStrictEqual(expected);
  });

  test('should handle array with null and undefined values', () => {
    const values = [null, undefined, 1];
    const expected = {
      value: null,
      next: {
        value: null, // undefined becomes null in the linked list
        next: {
          value: 1,
          next: {
            value: null,
            next: null,
          },
        },
      },
    };

    const result = generateLinkedList(values);
    expect(result).toStrictEqual(expected);
  });

  // Check match by comparison with snapshot
  test('should generate linked list from values 2', () => {
    const values = [1, 2, 3];
    const result = generateLinkedList(values);

    expect(result).toMatchSnapshot();
  });

  test('should generate linked list with mixed values snapshot', () => {
    const values = [1, 'two', true, null];
    const result = generateLinkedList(values);

    expect(result).toMatchSnapshot();
  });

  test('should generate empty linked list snapshot', () => {
    const values: number[] = [];
    const result = generateLinkedList(values);

    expect(result).toMatchSnapshot();
  });

  test('should generate complex object linked list snapshot', () => {
    const values = [
      { id: 1, name: 'first' },
      { id: 2, name: 'second' },
      { id: 3, name: 'third' },
    ];
    const result = generateLinkedList(values);

    expect(result).toMatchSnapshot();
  });
});