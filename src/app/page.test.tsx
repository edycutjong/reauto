import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from './page';
import { covalentGoldRushService, ExploitTrace, AutopsyReport } from '@/lib/covalent';
import React from 'react';

// Mock the service
vi.mock('@/lib/covalent', () => {
  return {
    covalentGoldRushService: {
      traceExploit: vi.fn(),
      generateAutopsyReport: vi.fn(),
    },
  };
});

// Mock components
vi.mock('@/components/StatusBar', () => ({
  StatusBar: () => <div data-testid="status-bar" />
}));

vi.mock('@/components/Footer', () => ({
  Footer: () => <div data-testid="footer" />
}));

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the gallery view by default', () => {
    render(<Home />);
    expect(screen.getByText('Cross-Chain Exploit Forensics')).toBeDefined();
    expect(screen.getByPlaceholderText(/Enter suspicious TX Hash/)).toBeDefined();
    expect(screen.getByText('Famous Exploits Database')).toBeDefined();
  });

  it('should handle custom TX trace', async () => {
    const mockTraceData = {
      sourceTx: 'Custom Source',
      amount: '10 ETH',
      launderSteps: [{ type: 'STEP', name: 'Step 1' }],
      cashOuts: [{ name: 'Out 1', detail: 'Detail 1' }]
    };
    vi.mocked(covalentGoldRushService.traceExploit).mockResolvedValue(mockTraceData);

    render(<Home />);
    
    // Test empty txHash branch in handleTrace
    const form = screen.getByRole('textbox').closest('form')!;
    fireEvent.submit(form);

    expect(screen.getByText(/Aggregating cross-chain traces/)).toBeDefined();
    
    await waitFor(() => {
      expect(screen.getByText('Tracing: Custom Analysis')).toBeDefined();
    });

    // Generate report to cover activeExploit?.id || "custom" branch
    const reportBtn = screen.getByText('Generate Death Certificate');
    fireEvent.click(reportBtn);

    await waitFor(() => {
      expect(screen.getByText('OFFICIAL AUTOPSY')).toBeInTheDocument();
    });
    
    // Verify fallback ID was used ("custom" is the fallback)
    expect(covalentGoldRushService.generateAutopsyReport).toHaveBeenCalledWith("custom");
  });

  it('should handle famous exploit selection', async () => {
    vi.mocked(covalentGoldRushService.traceExploit).mockResolvedValue({
      sourceTx: 'Wormhole',
      amount: '$320M',
      launderSteps: [],
      cashOuts: []
    });

    render(<Home />);
    
    const wormholeBtn = screen.getByText('Wormhole Exploit');
    fireEvent.click(wormholeBtn);

    await waitFor(() => {
      expect(screen.getByText('Tracing: Wormhole Exploit')).toBeDefined();
    });
  });

  it('should handle death certificate generation', async () => {
    vi.mocked(covalentGoldRushService.traceExploit).mockResolvedValue({
      sourceTx: 'Wormhole',
      amount: '$320M',
      launderSteps: [],
      cashOuts: []
    });

    vi.mocked(covalentGoldRushService.generateAutopsyReport).mockResolvedValue({
      vector: 'Test Vector',
      summary: 'Test Summary',
      timeline: [{ time: 'T+0', description: 'Start' }]
    });

    render(<Home />);
    
    // Trigger trace first
    fireEvent.click(screen.getByText('Wormhole Exploit'));
    
    await waitFor(() => {
      expect(screen.getByText('Generate Death Certificate')).toBeDefined();
    });

    const reportBtn = screen.getByText('Generate Death Certificate');
    fireEvent.click(reportBtn);

    await waitFor(() => {
      expect(screen.getByText('OFFICIAL AUTOPSY')).toBeDefined();
      expect(screen.getByText('Test Vector')).toBeDefined();
      expect(screen.getByText('Test Summary')).toBeDefined();
    });

    // Test back button
    fireEvent.click(screen.getByText('← Back to Trace'));
    expect(screen.getByText('Tracing: Wormhole Exploit')).toBeDefined();
  });

  it('should navigate back to gallery', async () => {
    vi.mocked(covalentGoldRushService.traceExploit).mockResolvedValue({
      sourceTx: 'Wormhole',
      amount: '$320M',
      launderSteps: [],
      cashOuts: []
    });

    render(<Home />);
    fireEvent.click(screen.getByText('Wormhole Exploit'));

    await waitFor(() => {
      expect(screen.getByText('← Back to Gallery')).toBeDefined();
    });

    fireEvent.click(screen.getByText('← Back to Gallery'));
    expect(screen.getByText('Cross-Chain Exploit Forensics')).toBeDefined();
  });

  it('should use fallback values in UI when service data is incomplete', async () => {
    // Mock trace data with missing optional fields
    vi.mocked(covalentGoldRushService.traceExploit).mockResolvedValue({} as Partial<ExploitTrace> as ExploitTrace);
    
    // Mock report data with missing optional fields
    vi.mocked(covalentGoldRushService.generateAutopsyReport).mockResolvedValue({} as Partial<AutopsyReport> as AutopsyReport);

    render(<Home />);
    
    // Trigger trace
    fireEvent.click(screen.getByText('Wormhole Exploit'));
    
    await waitFor(() => {
      // Check fallbacks in trace view
      expect(screen.getAllByText('Wormhole Bridge').length).toBeGreaterThan(0);
      expect(screen.getByText('120,000 wETH')).toBeDefined();
      expect(screen.getByText('Tornado Cash')).toBeDefined();
      expect(screen.getByText('Binance Deposit')).toBeDefined();
    });

    // Trigger report
    fireEvent.click(screen.getByText('Generate Death Certificate'));

    await waitFor(() => {
      // Check fallbacks in report view
      expect(screen.getByText('Signature Forgery')).toBeDefined();
      expect(screen.getByText(/The attacker bypassed signature verification/)).toBeDefined();
      expect(screen.getByText('T+00:00')).toBeDefined();
    });
  });

  it('should update txHash on input change', () => {
    render(<Home />);
    const input = screen.getByPlaceholderText(/Enter suspicious TX Hash/) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '0x123' } });
    expect(input.value).toBe('0x123');
  });

  it('should handle form submission with custom txHash', async () => {
    vi.mocked(covalentGoldRushService.traceExploit).mockResolvedValue({
      sourceTx: 'Custom TX',
      amount: '1 ETH',
      launderSteps: [],
      cashOuts: []
    });

    render(<Home />);
    const input = screen.getByPlaceholderText(/Enter suspicious TX Hash/) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '0x123' } });
    
    const form = screen.getByRole('textbox').closest('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Tracing: Custom Analysis')).toBeDefined();
    });
  });

  it('should cover PDF download button click and multi-item timeline', async () => {
    vi.mocked(covalentGoldRushService.traceExploit).mockResolvedValue({
      sourceTx: 'Source',
      amount: '1 ETH',
      launderSteps: [],
      cashOuts: []
    });
    vi.mocked(covalentGoldRushService.generateAutopsyReport).mockResolvedValue({
      vector: 'Vector',
      summary: 'Summary',
      timeline: [
        { time: 'T+0', description: 'First' },
        { time: 'T+1', description: 'Second' }
      ]
    });

    render(<Home />);
    fireEvent.click(screen.getByText('Wormhole Exploit'));
    
    await waitFor(() => {
      expect(screen.getByText('Generate Death Certificate')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Generate Death Certificate'));

    await waitFor(() => {
      expect(screen.getByText('OFFICIAL AUTOPSY')).toBeInTheDocument();
    });

    expect(screen.getByText('First')).toBeDefined();
    expect(screen.getByText('Second')).toBeDefined();
    
    const downloadBtn = screen.getByText('Download PDF');
    fireEvent.click(downloadBtn);
  });
});
