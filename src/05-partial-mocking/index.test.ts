import { mockOne, mockTwo, mockThree, unmockedFunction } from './index';

jest.mock('./index', () => {
  const originalModule = jest.requireActual<typeof import('./index')>('./index');

  return {
    ...originalModule,
    mockOne: jest.fn(() => {}),
    mockTwo: jest.fn(() => {}),
    mockThree: jest.fn(() => {}),
  };
});

describe('partial mocking', () => {
  afterAll(() => {
    jest.unmock('./index');
  });

  test('mockOne, mockTwo, mockThree should not log into console', () => {
    const consoleSpy = jest.spyOn(console, 'log');

    mockOne();
    mockTwo();
    mockThree();

    expect(consoleSpy).not.toHaveBeenCalledWith('foo');
    expect(consoleSpy).not.toHaveBeenCalledWith('bar');
    expect(consoleSpy).not.toHaveBeenCalledWith('baz');

    consoleSpy.mockRestore();
  });

  test('mockOne, mockTwo, mockThree should be mocked functions', () => {
    expect(jest.isMockFunction(mockOne)).toBe(true);
    expect(jest.isMockFunction(mockTwo)).toBe(true);
    expect(jest.isMockFunction(mockThree)).toBe(true);
  });

  test('unmockedFunction should log into console', () => {
    const consoleSpy = jest.spyOn(console, 'log');

    unmockedFunction();

    expect(consoleSpy).toHaveBeenCalledWith('I am not mocked');

    consoleSpy.mockRestore();
  });

  test('unmockedFunction should not be mocked', () => {
    expect(jest.isMockFunction(unmockedFunction)).toBe(false);
  });

  test('mocked functions should be callable without side effects', () => {
    const consoleSpy = jest.spyOn(console, 'log');

    // Call the mocked functions multiple times
    mockOne();
    mockOne();
    mockTwo();
    mockThree();
    mockThree();
    mockThree();


    const allLogs = consoleSpy.mock.calls.flat();
    expect(allLogs).not.toContain('foo');
    expect(allLogs).not.toContain('bar');
    expect(allLogs).not.toContain('baz');


    expect(mockOne).toHaveBeenCalledTimes(2);
    expect(mockTwo).toHaveBeenCalledTimes(1);
    expect(mockThree).toHaveBeenCalledTimes(3);

    consoleSpy.mockRestore();
  });
});