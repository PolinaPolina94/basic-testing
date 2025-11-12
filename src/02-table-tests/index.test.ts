import { simpleCalculator, Action } from './index';

const validTestCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 2, b: 2, action: Action.Add, expected: 4 },
  { a: 3, b: 2, action: Action.Add, expected: 5 },
  { a: 10, b: 4, action: Action.Subtract, expected: 6 },
  { a: 15, b: 5, action: Action.Subtract, expected: 10 },
  { a: 7, b: 2, action: Action.Multiply, expected: 14 },
  { a: 3, b: 4, action: Action.Multiply, expected: 12 },
  { a: 15, b: 3, action: Action.Divide, expected: 5 },
  { a: 20, b: 4, action: Action.Divide, expected: 5 },
  { a: 2, b: 3, action: Action.Exponentiate, expected: 8 },
  { a: 5, b: 2, action: Action.Exponentiate, expected: 25 },
  { a: -5, b: 3, action: Action.Add, expected: -2 },
  { a: 0, b: 5, action: Action.Multiply, expected: 0 },
  { a: 2.5, b: 1.5, action: Action.Add, expected: 4 },
];

const invalidActionTestCases = [
  { a: 5, b: 3, action: 'invalid', expected: null },
  { a: 5, b: 3, action: '', expected: null },
  { a: 5, b: 3, action: null, expected: null },
  { a: 5, b: 3, action: undefined, expected: null },
];

const invalidArgumentsTestCases = [
  { a: '5', b: 3, action: Action.Add, expected: null },
  { a: 5, b: '3', action: Action.Add, expected: null },
  { a: '5', b: '3', action: Action.Add, expected: null },
  { a: null, b: 3, action: Action.Add, expected: null },
  { a: 5, b: undefined, action: Action.Add, expected: null },
  { a: {}, b: 3, action: Action.Add, expected: null },
];

describe('simpleCalculator', () => {
  describe('valid operations', () => {
    test.each(validTestCases)(
        'should return $expected when $a $action $b',
        ({ a, b, action, expected }) => {
          const result = simpleCalculator({ a, b, action });
          expect(result).toBe(expected);
        },
    );
  });

  describe('invalid actions', () => {
    test.each(invalidActionTestCases)(
        'should return null for invalid action: $action',
        ({ a, b, action, expected }) => {
          const result = simpleCalculator({ a, b, action });
          expect(result).toBe(expected);
        },
    );
  });

  describe('invalid arguments', () => {
    test.each(invalidArgumentsTestCases)(
        'should return null for invalid arguments: a=$a (type: ${typeof a}), b=$b (type: ${typeof b})',
        ({ a, b, action, expected }) => {
          const result = simpleCalculator({ a, b, action });
          expect(result).toBe(expected);
        },
    );
  });

  // Edge case: division by zero
  test('should handle division by zero', () => {
    const result = simpleCalculator({ a: 5, b: 0, action: Action.Divide });
    expect(result).toBe(Infinity);
  });

  // Edge case: exponentiation with negative exponent
  test('should handle negative exponents', () => {
    const result = simpleCalculator({ a: 2, b: -2, action: Action.Exponentiate });
    expect(result).toBe(0.25);
  });
});