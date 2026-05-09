import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CovalentGoldRushService } from './covalent';
import { GoldRushClient, ChainName } from "@covalenthq/client-sdk";

// Define mocks at the top level for persistence and easy access
const mockGetTransaction = vi.fn();
const mockGoldRushClientInstance = {
  TransactionService: {
    getTransaction: mockGetTransaction
  }
};

// Mock the Covalent SDK
vi.mock("@covalenthq/client-sdk", () => {
  return {
    GoldRushClient: vi.fn(function() {
      return mockGoldRushClientInstance;
    }),
    ChainName: {
      ETH_MAINNET: 'eth-mainnet',
    },
  };
});

describe('CovalentGoldRushService', () => {
  let service: CovalentGoldRushService;
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    service = new CovalentGoldRushService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.useRealTimers();
  });

  it('should initialize with API key from environment', () => {
    process.env.NEXT_PUBLIC_COVALENT_API_KEY = 'test-api-key';
    service.init();
    expect(GoldRushClient).toHaveBeenCalledWith('test-api-key');
  });

  it('should initialize with COVALENT_API_KEY if NEXT_PUBLIC_COVALENT_API_KEY is missing', () => {
    delete process.env.NEXT_PUBLIC_COVALENT_API_KEY;
    process.env.COVALENT_API_KEY = 'fallback-api-key';
    service.init();
    expect(GoldRushClient).toHaveBeenCalledWith('fallback-api-key');
  });

  it('should handle initialization failure', () => {
    process.env.NEXT_PUBLIC_COVALENT_API_KEY = 'bad-key';
    vi.mocked(GoldRushClient).mockImplementationOnce(() => {
      throw new Error('Init failed');
    });
    
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    service.init();
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to initialize client'), expect.any(Error));
  });

  it('should not re-initialize if already initialized', () => {
    process.env.NEXT_PUBLIC_COVALENT_API_KEY = 'test-api-key';
    service.init();
    service.init();
    expect(GoldRushClient).toHaveBeenCalledTimes(1);
  });

  it('should warn if no API key is provided', () => {
    delete process.env.NEXT_PUBLIC_COVALENT_API_KEY;
    delete process.env.COVALENT_API_KEY;
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    service.init();
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('No API key provided'));
  });

  it('should trace exploit using real client when available', async () => {
    process.env.NEXT_PUBLIC_COVALENT_API_KEY = 'test-key';
    mockGetTransaction.mockResolvedValue({
      error: false,
      data: {
        items: [{
          to_address: '0xattacker',
          value: '1000000000000000000', // 1 ETH
          gas_spent: '21000'
        }]
      }
    });

    service.init();
    const result = await service.traceExploit('0xhash');

    expect(mockGetTransaction).toHaveBeenCalledWith(ChainName.ETH_MAINNET, '0xhash');
    expect(result.amount).toBe('1.0000 ETH');
    expect(result.sourceTx).toBe('Contract: 0xattacker');
  });

  it('should use fallback if API response has error', async () => {
    process.env.NEXT_PUBLIC_COVALENT_API_KEY = 'test-key';
    mockGetTransaction.mockResolvedValue({
      error: true,
      error_message: 'API Error'
    });

    service.init();
    vi.useFakeTimers();
    const tracePromise = service.traceExploit('0xhash');
    await vi.advanceTimersByTimeAsync(2000);
    const result = await tracePromise;
    expect(result.sourceTx).toBe('Wormhole Bridge');
  });

  it('should use fallback if API response has no items', async () => {
    process.env.NEXT_PUBLIC_COVALENT_API_KEY = 'test-key';
    mockGetTransaction.mockResolvedValue({
      error: false,
      data: { items: [] }
    });

    service.init();
    vi.useFakeTimers();
    const tracePromise = service.traceExploit('0xhash');
    await vi.advanceTimersByTimeAsync(2000);
    const result = await tracePromise;
    expect(result.sourceTx).toBe('Wormhole Bridge');
  });

  it('should handle transaction trace failure and use fallback', async () => {
    process.env.NEXT_PUBLIC_COVALENT_API_KEY = 'test-key';
    mockGetTransaction.mockRejectedValue(new Error('API error'));
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    service.init();
    
    vi.useFakeTimers();
    const tracePromise = service.traceExploit('0xhash');
    
    // We need to wait for the catch block to run before advancing timers
    // Using advanceTimersByTimeAsync should handle this in Vitest 3+
    await vi.advanceTimersByTimeAsync(2000);
    
    const result = await tracePromise;

    expect(consoleSpy).toHaveBeenCalledWith("[GoldRush SDK] Transaction trace failed:", expect.any(Error));
    expect(result.sourceTx).toBe('Wormhole Bridge');
  });

  it('should use fallback if client is not initialized', async () => {
    delete process.env.NEXT_PUBLIC_COVALENT_API_KEY;
    delete process.env.COVALENT_API_KEY;
    service.init();
    
    vi.useFakeTimers();
    const tracePromise = service.traceExploit('0xhash');
    
    await vi.advanceTimersByTimeAsync(2000);
    
    const result = await tracePromise;

    expect(result.sourceTx).toBe('Wormhole Bridge');
  });

  it('should generate autopsy report', async () => {
    process.env.NEXT_PUBLIC_COVALENT_API_KEY = 'test-key';
    service.init();
    
    vi.useFakeTimers();
    const reportPromise = service.generateAutopsyReport('exploit-1');
    
    await vi.advanceTimersByTimeAsync(1000);
    
    const result = await reportPromise;

    expect(result.vector).toBe('Signature Forgery');
    expect(result.timeline.length).toBeGreaterThan(0);
  });

  it('should generate autopsy report even without client', async () => {
    delete process.env.NEXT_PUBLIC_COVALENT_API_KEY;
    service.init();
    
    vi.useFakeTimers();
    const reportPromise = service.generateAutopsyReport('exploit-1');
    
    await vi.advanceTimersByTimeAsync(1000);
    
    const result = await reportPromise;

    expect(result.vector).toBe('Signature Forgery');
  });
});
