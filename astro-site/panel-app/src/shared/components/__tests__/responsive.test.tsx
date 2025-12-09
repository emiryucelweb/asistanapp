/**
 * @vitest-environment jsdom
 * 
 * Mobile & Responsive Tests - ENTERPRISE GRADE
 * 
 * Tests for:
 * - Responsive breakpoint behavior
 * - Mobile navigation patterns
 * - Touch interaction handling
 * - Viewport-specific rendering
 * - Media query matching
 * - Mobile-first design validation
 * 
 * @group responsive
 * @group mobile
 * @group e2e
 * 
 * ALTIN KURALLAR:
 * ✅ AAA Pattern (Arrange-Act-Assert)
 * ✅ Tek test → tek davranış
 * ✅ State izolasyonu (beforeEach/afterEach)
 * ✅ Mock Stratejisi Tutarlı
 * ✅ Descriptive Naming
 * ✅ Edge Case Coverage
 * ✅ Real-World Scenarios
 * ✅ Accessibility Tests
 * ✅ Cleanup
 * ✅ Type Safety
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import React, { useState, useEffect } from 'react';

// ============================================================================
// VIEWPORT BREAKPOINTS
// ============================================================================

const BREAKPOINTS = {
  xs: 320,   // Extra small phones
  sm: 640,   // Small phones / landscape
  md: 768,   // Tablets
  lg: 1024,  // Desktop
  xl: 1280,  // Large desktop
  '2xl': 1536, // Extra large desktop
} as const;

// ============================================================================
// MOCK SETUP
// ============================================================================

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

// ============================================================================
// VIEWPORT UTILITIES
// ============================================================================

/**
 * Set viewport size for testing
 */
const setViewportSize = (width: number, height: number = 800) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  
  // Trigger resize event
  window.dispatchEvent(new Event('resize'));
};

/**
 * Mock matchMedia for responsive testing
 */
const mockMatchMedia = (width: number) => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => {
    // Parse min-width and max-width from query
    const minWidthMatch = query.match(/min-width:\s*(\d+)px/);
    const maxWidthMatch = query.match(/max-width:\s*(\d+)px/);
    
    let matches = true;
    
    if (minWidthMatch) {
      matches = matches && width >= parseInt(minWidthMatch[1]);
    }
    if (maxWidthMatch) {
      matches = matches && width <= parseInt(maxWidthMatch[1]);
    }
    
    return {
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
  });
};

// ============================================================================
// RESPONSIVE HOOK
// ============================================================================

/**
 * Hook to detect current breakpoint
 */
const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<keyof typeof BREAKPOINTS>('lg');
  
  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width < BREAKPOINTS.sm) {
        setBreakpoint('xs');
      } else if (width < BREAKPOINTS.md) {
        setBreakpoint('sm');
      } else if (width < BREAKPOINTS.lg) {
        setBreakpoint('md');
      } else if (width < BREAKPOINTS.xl) {
        setBreakpoint('lg');
      } else if (width < BREAKPOINTS['2xl']) {
        setBreakpoint('xl');
      } else {
        setBreakpoint('2xl');
      }
    };
    
    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);
  
  return breakpoint;
};

/**
 * Hook to check if viewport is mobile
 */
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.md);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
};

// ============================================================================
// RESPONSIVE COMPONENTS
// ============================================================================

/**
 * Responsive Navigation Component
 */
const ResponsiveNav: React.FC<{
  items: Array<{ label: string; href: string }>;
}> = ({ items }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  
  return (
    <nav className="bg-white dark:bg-slate-800 shadow" data-testid="nav">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold">Logo</span>
          </div>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="hidden md:flex items-center space-x-4" data-testid="desktop-menu">
              {items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2"
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}
          
          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              data-testid="mobile-menu-button"
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          )}
        </div>
        
        {/* Mobile Menu */}
        {isMobile && isMenuOpen && (
          <div className="md:hidden py-4 space-y-2" data-testid="mobile-menu">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 px-3 py-2 rounded"
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

/**
 * Responsive Grid Component
 */
const ResponsiveGrid: React.FC<{
  items: Array<{ id: string; content: React.ReactNode }>;
}> = ({ items }) => {
  const breakpoint = useBreakpoint();
  
  const getGridCols = () => {
    switch (breakpoint) {
      case 'xs':
      case 'sm':
        return 1;
      case 'md':
        return 2;
      case 'lg':
        return 3;
      case 'xl':
      case '2xl':
        return 4;
      default:
        return 3;
    }
  };
  
  const cols = getGridCols();
  
  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      data-testid="responsive-grid"
      data-columns={cols}
    >
      {items.map((item) => (
        <div key={item.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
          {item.content}
        </div>
      ))}
    </div>
  );
};

/**
 * Responsive Modal Component
 */
const ResponsiveModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  const isMobile = useIsMobile();
  
  if (!isOpen) return null;
  
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      data-testid="modal"
    >
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div
        className={`
          relative bg-white dark:bg-slate-800 rounded-xl shadow-xl
          ${isMobile 
            ? 'fixed inset-x-0 bottom-0 rounded-b-none max-h-[90vh]' 
            : 'max-w-md w-full mx-4'
          }
        `}
        data-testid="modal-content"
        data-mobile={isMobile}
      >
        <div className="p-6">
          {children}
        </div>
        <button
          className="absolute top-4 right-4 p-2"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

/**
 * Responsive Table/Card Component
 */
const ResponsiveTable: React.FC<{
  data: Array<{ id: string; name: string; email: string; status: string }>;
}> = ({ data }) => {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    // Card layout for mobile
    return (
      <div className="space-y-4" data-testid="mobile-cards">
        {data.map((item) => (
          <div key={item.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
            <div className="font-semibold">{item.name}</div>
            <div className="text-sm text-gray-500">{item.email}</div>
            <div className="mt-2">
              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  // Table layout for desktop
  return (
    <table className="w-full" data-testid="desktop-table">
      <thead>
        <tr className="border-b dark:border-slate-700">
          <th className="text-left py-3 px-4">Name</th>
          <th className="text-left py-3 px-4">Email</th>
          <th className="text-left py-3 px-4">Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id} className="border-b dark:border-slate-700">
            <td className="py-3 px-4">{item.name}</td>
            <td className="py-3 px-4">{item.email}</td>
            <td className="py-3 px-4">
              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                {item.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// ============================================================================
// RESPONSIVE NAVIGATION TESTS
// ============================================================================

describe('Responsive Navigation', () => {
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it('should show desktop menu on large screens', async () => {
    // Arrange
    setViewportSize(BREAKPOINTS.lg);
    mockMatchMedia(BREAKPOINTS.lg);

    // Act
    render(<ResponsiveNav items={navItems} />);

    // Wait for effect to run
    await waitFor(() => {
      // Assert
      expect(screen.getByTestId('desktop-menu')).toBeInTheDocument();
      expect(screen.queryByTestId('mobile-menu-button')).not.toBeInTheDocument();
    });
  });

  it('should show mobile menu button on small screens', async () => {
    // Arrange
    setViewportSize(BREAKPOINTS.sm);
    mockMatchMedia(BREAKPOINTS.sm);

    // Act
    render(<ResponsiveNav items={navItems} />);

    // Wait for effect to run
    await waitFor(() => {
      // Assert
      expect(screen.getByTestId('mobile-menu-button')).toBeInTheDocument();
      expect(screen.queryByTestId('desktop-menu')).not.toBeInTheDocument();
    });
  });

  it('should toggle mobile menu on button click', async () => {
    // Arrange
    setViewportSize(BREAKPOINTS.sm);
    mockMatchMedia(BREAKPOINTS.sm);

    render(<ResponsiveNav items={navItems} />);

    await waitFor(() => {
      expect(screen.getByTestId('mobile-menu-button')).toBeInTheDocument();
    });

    // Act - Open menu
    fireEvent.click(screen.getByTestId('mobile-menu-button'));

    // Assert - Menu is open
    await waitFor(() => {
      expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
    });

    // Act - Close menu
    fireEvent.click(screen.getByTestId('mobile-menu-button'));

    // Assert - Menu is closed
    await waitFor(() => {
      expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
    });
  });

  it('should have correct aria attributes on mobile menu button', async () => {
    // Arrange
    setViewportSize(BREAKPOINTS.sm);
    mockMatchMedia(BREAKPOINTS.sm);

    render(<ResponsiveNav items={navItems} />);

    await waitFor(() => {
      expect(screen.getByTestId('mobile-menu-button')).toBeInTheDocument();
    });

    // Assert - Initial state
    const button = screen.getByTestId('mobile-menu-button');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-label', 'Open menu');

    // Act - Open menu
    fireEvent.click(button);

    // Assert - Open state
    await waitFor(() => {
      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(button).toHaveAttribute('aria-label', 'Close menu');
    });
  });
});

// ============================================================================
// RESPONSIVE GRID TESTS
// ============================================================================

describe('Responsive Grid', () => {
  const gridItems = [
    { id: '1', content: <span>Item 1</span> },
    { id: '2', content: <span>Item 2</span> },
    { id: '3', content: <span>Item 3</span> },
    { id: '4', content: <span>Item 4</span> },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it('should show 1 column on extra small screens', async () => {
    // Arrange
    setViewportSize(BREAKPOINTS.xs);
    mockMatchMedia(BREAKPOINTS.xs);

    // Act
    render(<ResponsiveGrid items={gridItems} />);

    // Assert
    await waitFor(() => {
      const grid = screen.getByTestId('responsive-grid');
      expect(grid).toHaveAttribute('data-columns', '1');
    });
  });

  it('should show 2 columns on medium screens', async () => {
    // Arrange
    setViewportSize(BREAKPOINTS.md);
    mockMatchMedia(BREAKPOINTS.md);

    // Act
    render(<ResponsiveGrid items={gridItems} />);

    // Assert
    await waitFor(() => {
      const grid = screen.getByTestId('responsive-grid');
      expect(grid).toHaveAttribute('data-columns', '2');
    });
  });

  it('should show 3 columns on large screens', async () => {
    // Arrange
    setViewportSize(BREAKPOINTS.lg);
    mockMatchMedia(BREAKPOINTS.lg);

    // Act
    render(<ResponsiveGrid items={gridItems} />);

    // Assert
    await waitFor(() => {
      const grid = screen.getByTestId('responsive-grid');
      expect(grid).toHaveAttribute('data-columns', '3');
    });
  });

  it('should show 4 columns on extra large screens', async () => {
    // Arrange
    setViewportSize(BREAKPOINTS.xl);
    mockMatchMedia(BREAKPOINTS.xl);

    // Act
    render(<ResponsiveGrid items={gridItems} />);

    // Assert
    await waitFor(() => {
      const grid = screen.getByTestId('responsive-grid');
      expect(grid).toHaveAttribute('data-columns', '4');
    });
  });

  it('should update columns on viewport resize', async () => {
    // Arrange - Start with large screen
    setViewportSize(BREAKPOINTS.lg);
    mockMatchMedia(BREAKPOINTS.lg);

    const { rerender } = render(<ResponsiveGrid items={gridItems} />);

    await waitFor(() => {
      expect(screen.getByTestId('responsive-grid')).toHaveAttribute('data-columns', '3');
    });

    // Act - Resize to mobile
    setViewportSize(BREAKPOINTS.sm);
    mockMatchMedia(BREAKPOINTS.sm);
    rerender(<ResponsiveGrid items={gridItems} />);

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('responsive-grid')).toHaveAttribute('data-columns', '1');
    });
  });
});

// ============================================================================
// RESPONSIVE MODAL TESTS
// ============================================================================

describe('Responsive Modal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it('should render as bottom sheet on mobile', async () => {
    // Arrange
    setViewportSize(BREAKPOINTS.sm);
    mockMatchMedia(BREAKPOINTS.sm);

    // Act
    render(
      <ResponsiveModal isOpen={true} onClose={() => {}}>
        <p>Modal content</p>
      </ResponsiveModal>
    );

    // Assert
    await waitFor(() => {
      const modalContent = screen.getByTestId('modal-content');
      expect(modalContent).toHaveAttribute('data-mobile', 'true');
    });
  });

  it('should render as centered modal on desktop', async () => {
    // Arrange
    setViewportSize(BREAKPOINTS.lg);
    mockMatchMedia(BREAKPOINTS.lg);

    // Act
    render(
      <ResponsiveModal isOpen={true} onClose={() => {}}>
        <p>Modal content</p>
      </ResponsiveModal>
    );

    // Assert
    await waitFor(() => {
      const modalContent = screen.getByTestId('modal-content');
      expect(modalContent).toHaveAttribute('data-mobile', 'false');
    });
  });

  it('should not render when closed', () => {
    // Arrange
    setViewportSize(BREAKPOINTS.lg);
    mockMatchMedia(BREAKPOINTS.lg);

    // Act
    render(
      <ResponsiveModal isOpen={false} onClose={() => {}}>
        <p>Modal content</p>
      </ResponsiveModal>
    );

    // Assert
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('should call onClose when backdrop is clicked', async () => {
    // Arrange
    const onClose = vi.fn();
    setViewportSize(BREAKPOINTS.lg);
    mockMatchMedia(BREAKPOINTS.lg);

    render(
      <ResponsiveModal isOpen={true} onClose={onClose}>
        <p>Modal content</p>
      </ResponsiveModal>
    );

    // Act - Click backdrop
    const modal = screen.getByTestId('modal');
    const backdrop = modal.querySelector('.bg-black\\/50');
    if (backdrop) {
      fireEvent.click(backdrop);
    }

    // Assert
    expect(onClose).toHaveBeenCalled();
  });

  it('should have correct accessibility attributes', async () => {
    // Arrange
    setViewportSize(BREAKPOINTS.lg);
    mockMatchMedia(BREAKPOINTS.lg);

    // Act
    render(
      <ResponsiveModal isOpen={true} onClose={() => {}}>
        <p>Modal content</p>
      </ResponsiveModal>
    );

    // Assert
    const modal = screen.getByTestId('modal');
    expect(modal).toHaveAttribute('role', 'dialog');
    expect(modal).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
  });
});

// ============================================================================
// RESPONSIVE TABLE TESTS
// ============================================================================

describe('Responsive Table', () => {
  const tableData = [
    { id: '1', name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'Active' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it('should render as table on desktop', async () => {
    // Arrange
    setViewportSize(BREAKPOINTS.lg);
    mockMatchMedia(BREAKPOINTS.lg);

    // Act
    render(<ResponsiveTable data={tableData} />);

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('desktop-table')).toBeInTheDocument();
      expect(screen.queryByTestId('mobile-cards')).not.toBeInTheDocument();
    });
  });

  it('should render as cards on mobile', async () => {
    // Arrange
    setViewportSize(BREAKPOINTS.sm);
    mockMatchMedia(BREAKPOINTS.sm);

    // Act
    render(<ResponsiveTable data={tableData} />);

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('mobile-cards')).toBeInTheDocument();
      expect(screen.queryByTestId('desktop-table')).not.toBeInTheDocument();
    });
  });

  it('should display all data items on mobile', async () => {
    // Arrange
    setViewportSize(BREAKPOINTS.sm);
    mockMatchMedia(BREAKPOINTS.sm);

    // Act
    render(<ResponsiveTable data={tableData} />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });
});

// ============================================================================
// TOUCH INTERACTION TESTS
// ============================================================================

describe('Touch Interactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it('should handle touch start event', () => {
    // Arrange
    const onTouchStart = vi.fn();
    
    const TouchButton: React.FC = () => (
      <button onTouchStart={onTouchStart} data-testid="touch-button">
        Touch Me
      </button>
    );

    render(<TouchButton />);

    // Act
    fireEvent.touchStart(screen.getByTestId('touch-button'));

    // Assert
    expect(onTouchStart).toHaveBeenCalled();
  });

  it('should handle swipe gesture', () => {
    // Arrange
    const onSwipe = vi.fn();
    
    const SwipeArea: React.FC = () => {
      const [startX, setStartX] = React.useState(0);
      
      return (
        <div
          data-testid="swipe-area"
          onTouchStart={(e) => setStartX(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            const endX = e.changedTouches[0].clientX;
            const diff = endX - startX;
            if (Math.abs(diff) > 50) {
              onSwipe(diff > 0 ? 'right' : 'left');
            }
          }}
          style={{ width: 300, height: 200 }}
        >
          Swipe Area
        </div>
      );
    };

    render(<SwipeArea />);

    // Act - Simulate swipe right
    const area = screen.getByTestId('swipe-area');
    fireEvent.touchStart(area, { touches: [{ clientX: 0 }] });
    fireEvent.touchEnd(area, { changedTouches: [{ clientX: 100 }] });

    // Assert
    expect(onSwipe).toHaveBeenCalledWith('right');
  });
});

// ============================================================================
// BREAKPOINT HOOK TESTS
// ============================================================================

describe('useBreakpoint Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it('should return correct breakpoint for viewport width', async () => {
    // Arrange
    setViewportSize(BREAKPOINTS.md);
    mockMatchMedia(BREAKPOINTS.md);

    const BreakpointDisplay: React.FC = () => {
      const breakpoint = useBreakpoint();
      return <div data-testid="breakpoint">{breakpoint}</div>;
    };

    // Act
    render(<BreakpointDisplay />);

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('breakpoint')).toHaveTextContent('md');
    });
  });
});

// ============================================================================
// MEDIA QUERY TESTS
// ============================================================================

describe('Media Query Matching', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it('should match min-width media query', () => {
    // Arrange
    mockMatchMedia(1024);

    // Act
    const result = window.matchMedia('(min-width: 768px)');

    // Assert
    expect(result.matches).toBe(true);
  });

  it('should not match min-width when viewport is smaller', () => {
    // Arrange
    mockMatchMedia(600);

    // Act
    const result = window.matchMedia('(min-width: 768px)');

    // Assert
    expect(result.matches).toBe(false);
  });

  it('should match max-width media query', () => {
    // Arrange
    mockMatchMedia(600);

    // Act
    const result = window.matchMedia('(max-width: 768px)');

    // Assert
    expect(result.matches).toBe(true);
  });

  it('should match dark mode preference', () => {
    // Arrange
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    // Act
    const result = window.matchMedia('(prefers-color-scheme: dark)');

    // Assert
    expect(result.matches).toBe(true);
  });
});

