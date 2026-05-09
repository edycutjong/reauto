import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AboutPage from './page';
import React from 'react';

// Mock Next.js Link
vi.mock('next/link', () => {
  return {
    default: ({ children, href }: { children: React.ReactNode, href: string }) => (
      <a href={href}>{children}</a>
    ),
  };
});

describe('AboutPage', () => {
  it('should render about page details', () => {
    render(<AboutPage />);
    expect(screen.getByText('ExploitTracer')).toBeDefined();
    expect(screen.getByText(/Colosseum Frontier Hackathon 2026/)).toBeDefined();
    expect(screen.getByText('WHAT IT DOES')).toBeDefined();
    expect(screen.getByText('TECH STACK')).toBeDefined();
  });

  it('should render back link', () => {
    render(<AboutPage />);
    const backLink = screen.getByText('← Back to Dashboard');
    expect(backLink).toBeDefined();
    expect(backLink.closest('a')).toHaveAttribute('href', '/');
  });

  it('should render launch dashboard button', () => {
    render(<AboutPage />);
    const launchBtn = screen.getByText('Launch Dashboard →');
    expect(launchBtn).toBeDefined();
    expect(launchBtn.closest('a')).toHaveAttribute('href', '/');
  });
});
