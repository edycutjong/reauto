import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { AnimatedBackground } from './AnimatedBackground';
import React from 'react';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: (_target, prop) => {
      const Component = React.forwardRef(function MotionMock({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>, ref: React.Ref<HTMLElement>) {
        const filteredProps: Record<string, unknown> = {};
        for (const key of Object.keys(props)) {
          if (!['initial', 'animate', 'exit', 'transition', 'variants', 'whileHover', 'whileTap', 'layout'].includes(key)) {
            filteredProps[key] = props[key];
          }
        }
        return React.createElement(prop as string, { ...filteredProps, ref }, children);
      });
      Component.displayName = `motion.${String(prop)}`;
      return Component;
    },
  }),
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

describe('AnimatedBackground', () => {
  it('should render the animated background with grid and orbs', () => {
    const { container } = render(<AnimatedBackground />);
    const fixedEl = container.querySelector('.fixed');
    expect(fixedEl).toBeDefined();
    // Should have child elements (grid + 3 orbs)
    expect(container.firstChild?.childNodes.length).toBeGreaterThanOrEqual(2);
  });
});
