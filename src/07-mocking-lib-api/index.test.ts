import axios from 'axios';
import { throttledGetDataFromApi, THROTTLE_TIME } from './index';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock lodash throttle
jest.mock('lodash', () => ({
  throttle: jest.fn((fn) => fn),
}));

describe('throttledGetDataFromApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create instance with provided base url', async () => {
    const relativePath = '/posts/1';
    const mockResponse = { data: { id: 1, title: 'Test Post' } };

    // Mock axios.create to return a mock instance
    const mockGet = jest.fn().mockResolvedValue(mockResponse);
    const mockInstance = { get: mockGet };
    mockedAxios.create.mockReturnValue(mockInstance as any);

    await throttledGetDataFromApi(relativePath);

    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const relativePath = '/users/1';
    const mockResponse = { data: { id: 1, name: 'John Doe' } };

    const mockGet = jest.fn().mockResolvedValue(mockResponse);
    const mockInstance = { get: mockGet };
    mockedAxios.create.mockReturnValue(mockInstance as any);

    await throttledGetDataFromApi(relativePath);

    expect(mockGet).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    const relativePath = '/posts/1';
    const expectedData = { id: 1, title: 'Test Post', body: 'Test content' };
    const mockResponse = { data: expectedData };

    const mockGet = jest.fn().mockResolvedValue(mockResponse);
    const mockInstance = { get: mockGet };
    mockedAxios.create.mockReturnValue(mockInstance as any);

    const result = await throttledGetDataFromApi(relativePath);

    expect(result).toEqual(expectedData);
  });

  test('should use throttle with correct time', async () => {
    const { throttle } = require('lodash');
    const mockThrottle = throttle as jest.Mock;

    // Reset the mock to see how it's called
    mockThrottle.mockClear();

    // Re-import to trigger the throttle call
    jest.isolateModules(() => {
      require('./index');
    });

    expect(mockThrottle).toHaveBeenCalledWith(expect.any(Function), THROTTLE_TIME);
  });

  test('should handle axios errors', async () => {
    const relativePath = '/invalid-path';
    const errorMessage = 'Request failed';

    const mockGet = jest.fn().mockRejectedValue(new Error(errorMessage));
    const mockInstance = { get: mockGet };
    mockedAxios.create.mockReturnValue(mockInstance as any);

    await expect(throttledGetDataFromApi(relativePath)).rejects.toThrow(errorMessage);
  });
});