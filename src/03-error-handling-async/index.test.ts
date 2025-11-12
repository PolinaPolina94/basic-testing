import {
  throwError,
  throwCustomError,
  resolveValue,
  MyAwesomeError,
  rejectCustomError,
} from './index';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    const testValue = 'test value';
    const result = await resolveValue(testValue);
    expect(result).toBe(testValue);
  });

  test('should resolve different types of values', async () => {
    const testCases = [
      'string value',
      42,
      { key: 'value' },
      [1, 2, 3],
      null,
      undefined,
    ];

    for (const value of testCases) {
      const result = await resolveValue(value);
      expect(result).toBe(value);
    }
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    const customMessage = 'Custom error message';

    expect(() => {
      throwError(customMessage);
    }).toThrow(customMessage);
  });

  test('should throw error with default message if message is not provided', () => {
    expect(() => {
      throwError();
    }).toThrow('Oops!');
  });

  test('should throw an instance of Error', () => {
    expect(() => {
      throwError();
    }).toThrow(Error);
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    expect(() => {
      throwCustomError();
    }).toThrow(MyAwesomeError);
  });

  test('should throw error with correct message', () => {
    expect(() => {
      throwCustomError();
    }).toThrow('This is my awesome custom error!');
  });

  test('should be instance of MyAwesomeError', () => {
    try {
      throwCustomError();
    } catch (error) {
      expect(error).toBeInstanceOf(MyAwesomeError);
      expect(error).toBeInstanceOf(Error);
    }
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    await expect(rejectCustomError()).rejects.toThrow(MyAwesomeError);
  });

  test('should reject with correct error message', async () => {
    await expect(rejectCustomError()).rejects.toThrow('This is my awesome custom error!');
  });

  test('should reject with MyAwesomeError instance', async () => {
    try {
      await rejectCustomError();
    } catch (error) {
      expect(error).toBeInstanceOf(MyAwesomeError);
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('should handle rejection with try-catch', async () => {
    expect.assertions(2);

    try {
      await rejectCustomError();
    } catch (error) {
      expect(error).toBeInstanceOf(MyAwesomeError);
      expect((error as MyAwesomeError).message).toBe('This is my awesome custom error!');
    }
  });
});