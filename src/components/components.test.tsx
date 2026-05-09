import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';
import { StatusBar } from './StatusBar';
import { TechStack } from './TechStack';
import React from 'react';

describe('Shared Components', () => {
  describe('Footer', () => {
    it('should render footer text', () => {
      render(<Footer />);
      expect(screen.getByText(/ExploitTracer/)).toBeDefined();
      expect(screen.getByText(/Colosseum Frontier Hackathon 2026/)).toBeDefined();
    });
  });

  describe('StatusBar', () => {
    it('should render system status', () => {
      render(<StatusBar />);
      expect(screen.getByText(/SYSTEM ONLINE/)).toBeDefined();
      expect(screen.getByText(/LATENCY:/)).toBeDefined();
      expect(screen.getByText(/12ms/)).toBeDefined();
    });
  });

  describe('TechStack', () => {
    it('should render all tech items', () => {
      render(<TechStack />);
      expect(screen.getByText('Next.js 16')).toBeDefined();
      expect(screen.getByText('React 19')).toBeDefined();
      expect(screen.getByText('Tailwind v4')).toBeDefined();
      expect(screen.getByText('Solana')).toBeDefined();
    });
  });
});
