import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

// Mock the fs and path modules
jest.mock('fs');
jest.mock('fs/promises');
jest.mock('path', () => {
  const actualPath = jest.requireActual('path');
  return {
    ...actualPath,
    join: jest.fn(),
  };
});

const mockedExistsSync = existsSync as jest.MockedFunction<typeof existsSync>;
const mockedReadFile = readFile as jest.MockedFunction<typeof readFile>;
const mockedJoin = join as jest.MockedFunction<typeof join>;

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;

    doStuffByTimeout(callback, timeout);

    expect(jest.getTimerCount()).toBe(1);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;

    doStuffByTimeout(callback, timeout);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(timeout);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('should not call callback before timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;

    doStuffByTimeout(callback, timeout);

    jest.advanceTimersByTime(500);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(500);

    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and interval', () => {
    const callback = jest.fn();
    const interval = 1000;

    doStuffByInterval(callback, interval);

    expect(jest.getTimerCount()).toBe(1);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    const interval = 1000;

    doStuffByInterval(callback, interval);

    jest.advanceTimersByTime(interval * 3);

    expect(callback).toHaveBeenCalledTimes(3);

    jest.advanceTimersByTime(interval * 2);

    expect(callback).toHaveBeenCalledTimes(5);
  });

  test('should call callback at correct intervals', () => {
    const callback = jest.fn();
    const interval = 1000;

    doStuffByInterval(callback, interval);

    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call join with pathToFile', async () => {
    const pathToFile = 'test.txt';

    mockedJoin.mockReturnValue('/mock/path');
    mockedExistsSync.mockReturnValue(false);

    await readFileAsynchronously(pathToFile);

    expect(mockedJoin).toHaveBeenCalledWith(__dirname, pathToFile);
    expect(mockedJoin).toHaveBeenCalledTimes(1);
  });

  test('should return null if file does not exist', async () => {
    const pathToFile = 'nonexistent.txt';

    mockedJoin.mockReturnValue('/mock/path');
    mockedExistsSync.mockReturnValue(false);

    const result = await readFileAsynchronously(pathToFile);

    expect(result).toBeNull();
    expect(mockedExistsSync).toHaveBeenCalledWith('/mock/path');
    expect(mockedReadFile).not.toHaveBeenCalled();
  });

  test('should return file content if file exists', async () => {
    const pathToFile = 'existing.txt';
    const fileContent = 'Hello, World!';
    const buffer = Buffer.from(fileContent);

    mockedJoin.mockReturnValue('/mock/path');
    mockedExistsSync.mockReturnValue(true);
    mockedReadFile.mockResolvedValue(buffer);

    const result = await readFileAsynchronously(pathToFile);

    expect(result).toBe(fileContent);
    expect(mockedExistsSync).toHaveBeenCalledWith('/mock/path');
    expect(mockedReadFile).toHaveBeenCalledWith('/mock/path');
  });

  test('should handle file read errors gracefully', async () => {
    const pathToFile = 'error.txt';

    mockedJoin.mockReturnValue('/mock/path');
    mockedExistsSync.mockReturnValue(true);
    mockedReadFile.mockRejectedValue(new Error('Read error'));

    await expect(readFileAsynchronously(pathToFile)).rejects.toThrow('Read error');
  });

  test('should construct correct full path', async () => {
    const pathToFile = 'subdir/file.txt';
    const expectedPath = '/full/path/to/file';

    mockedJoin.mockReturnValue(expectedPath);
    mockedExistsSync.mockReturnValue(false);

    await readFileAsynchronously(pathToFile);

    expect(mockedJoin).toHaveBeenCalledWith(__dirname, pathToFile);
  });
});