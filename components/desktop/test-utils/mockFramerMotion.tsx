import React from 'react'
import { vi } from 'vitest'

type MockMotionDivProps = Record<string, unknown> &
  React.HTMLAttributes<HTMLDivElement> & {
    children?: React.ReactNode
  }

const MOTION_PROP_KEYS = new Set([
  'animate',
  'custom',
  'drag',
  'dragControls',
  'dragElastic',
  'dragListener',
  'dragMomentum',
  'exit',
  'initial',
  'layout',
  'layoutId',
  'onAnimationComplete',
  'onAnimationStart',
  'onDrag',
  'onDragEnd',
  'onDragStart',
  'onHoverEnd',
  'onHoverStart',
  'onPan',
  'onPanEnd',
  'onPanStart',
  'transition',
  'variants',
  'viewport',
  'whileHover',
  'whileInView',
  'whileTap',
])

function sanitizeMotionProps(props: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(props).filter(([key]) => !MOTION_PROP_KEYS.has(key)))
}

export function createMockMotionDiv() {
  const MotionDiv = React.forwardRef<HTMLDivElement, MockMotionDivProps>(({ children, ...props }, ref) => (
    <div ref={ref} {...(sanitizeMotionProps(props) as React.HTMLAttributes<HTMLDivElement>)}>
      {children as React.ReactNode}
    </div>
  ))

  MotionDiv.displayName = 'MockMotionDiv'

  return MotionDiv
}

export function mockFramerMotion(overrides: Record<string, unknown> = {}) {
  return {
    motion: {
      div: createMockMotionDiv(),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useDragControls: () => ({ start: vi.fn() }),
    ...overrides,
  }
}
