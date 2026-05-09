import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NotFound from './not-found';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, 'data-testid': dataTestId }: { children?: React.ReactNode; className?: string; 'data-testid'?: string }) => {
      return <div className={className} data-testid={dataTestId}>{children}</div>;
    },
  },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}));

// Mock the AnimatedBackground component
vi.mock('@/components/AnimatedBackground', () => ({
  AnimatedBackground: () => <div data-testid="animated-background">Background</div>,
}));

describe('NotFound Page', () => {
  it('renders the 404 heading and message', () => {
    render(<NotFound />);
    
    // Check heading
    const heading = screen.getByText('404');
    expect(heading).toBeInTheDocument();
    
    // Check message
    const message = screen.getByText('Exploit Trace Not Found.');
    expect(message).toBeInTheDocument();
  });

  it('renders the return link', () => {
    render(<NotFound />);
    
    const returnLink = screen.getByRole('link', { name: /Return to Dashboard/i });
    expect(returnLink).toBeInTheDocument();
    expect(returnLink).toHaveAttribute('href', '/');
  });

  it('renders the animated background', () => {
    render(<NotFound />);
    
    const background = screen.getByTestId('animated-background');
    expect(background).toBeInTheDocument();
  });
});
