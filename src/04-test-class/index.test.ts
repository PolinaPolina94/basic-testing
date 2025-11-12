import { getBankAccount, InsufficientFundsError, TransferFailedError, SynchronizationFailedError } from './index';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const initialBalance = 100;
    const account = getBankAccount(initialBalance);
    expect(account.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const initialBalance = 100;
    const account = getBankAccount(initialBalance);

    expect(() => {
      account.withdraw(150);
    }).toThrow(InsufficientFundsError);
  });

  test('should throw InsufficientFundsError with correct message when withdrawing more than balance', () => {
    const initialBalance = 100;
    const account = getBankAccount(initialBalance);

    expect(() => {
      account.withdraw(150);
    }).toThrow(`Insufficient funds: cannot withdraw more than ${initialBalance}`);
  });

  test('should throw error when transferring more than balance', () => {
    const account1 = getBankAccount(100);
    const account2 = getBankAccount(50);

    expect(() => {
      account1.transfer(150, account2);
    }).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    const account = getBankAccount(100);

    expect(() => {
      account.transfer(50, account);
    }).toThrow(TransferFailedError);
  });

  test('should throw TransferFailedError with correct message when transferring to same account', () => {
    const account = getBankAccount(100);

    expect(() => {
      account.transfer(50, account);
    }).toThrow('Transfer failed');
  });

  test('should deposit money', () => {
    const initialBalance = 100;
    const depositAmount = 50;
    const account = getBankAccount(initialBalance);

    account.deposit(depositAmount);

    expect(account.getBalance()).toBe(initialBalance + depositAmount);
  });

  test('should withdraw money', () => {
    const initialBalance = 100;
    const withdrawAmount = 50;
    const account = getBankAccount(initialBalance);

    account.withdraw(withdrawAmount);

    expect(account.getBalance()).toBe(initialBalance - withdrawAmount);
  });

  test('should transfer money', () => {
    const initialBalance1 = 100;
    const initialBalance2 = 50;
    const transferAmount = 30;

    const account1 = getBankAccount(initialBalance1);
    const account2 = getBankAccount(initialBalance2);

    account1.transfer(transferAmount, account2);

    expect(account1.getBalance()).toBe(initialBalance1 - transferAmount);
    expect(account2.getBalance()).toBe(initialBalance2 + transferAmount);
  });

  test('should support method chaining', () => {
    const account = getBankAccount(100);

    const result = account.deposit(50).withdraw(25);

    expect(result).toBe(account);
    expect(account.getBalance()).toBe(125);
  });

  test('fetchBalance should return either number or null', async () => {
    const account = getBankAccount(100);

    const result = await account.fetchBalance();

    // Проверяем что возвращается либо число, либо null
    expect(result === null || typeof result === 'number').toBe(true);

    if (typeof result === 'number') {
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(100);
    }
  });

  test('synchronizeBalance should either update balance or throw error', async () => {
    const account = getBankAccount(100);

    try {
      await account.synchronizeBalance();
      // Если успешно, баланс должен быть числом между 0 и 100
      const newBalance = account.getBalance();
      expect(newBalance).toBeGreaterThanOrEqual(0);
      expect(newBalance).toBeLessThanOrEqual(100);
    } catch (error) {
      // Если ошибка, это должна быть SynchronizationFailedError
      expect(error).toBeInstanceOf(SynchronizationFailedError);
    }
  });

  test('should handle multiple operations correctly', () => {
    const account = getBankAccount(100);

    account.deposit(50).withdraw(25).deposit(10);

    expect(account.getBalance()).toBe(135);
  });

  test('should allow withdrawing exact balance amount', () => {
    const initialBalance = 100;
    const account = getBankAccount(initialBalance);

    account.withdraw(initialBalance);

    expect(account.getBalance()).toBe(0);
  });

  test('InsufficientFundsError should be instance of Error', () => {
    const account = getBankAccount(100);

    expect(() => {
      account.withdraw(150);
    }).toThrow(Error);
  });

  test('should handle zero balance correctly', () => {
    const account = getBankAccount(0);

    expect(account.getBalance()).toBe(0);

    expect(() => {
      account.withdraw(1);
    }).toThrow(InsufficientFundsError);
  });
});