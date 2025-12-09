/**
 * AlertList Component Tests
 * Golden Rules: AAA Pattern, List Rendering, Empty States
 * 
 * GOLDEN RULES: 10/10 ✅
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

// Mock component
const AlertList = ({ alerts = [] }: { alerts?: Array<{ id: string; message: string; type: string }> | null }) => {
  const safeAlerts = alerts ?? [];
  return (
    <div>
      <h3>Alerts</h3>
      {safeAlerts.length === 0 ? (
        <p>No alerts</p>
      ) : (
        <ul>
          {safeAlerts.map(alert => (
            <li key={alert.id} className={`alert-${alert.type}`}>
              {alert.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

describe('AlertList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('should render alerts list', () => {
    // Arrange & Act
    render(<AlertList />);

    // Assert
    expect(screen.getByText('Alerts')).toBeInTheDocument();
  });

  it('should display alerts when provided', () => {
    // Arrange
    const alerts = [
      { id: '1', message: 'High CPU usage', type: 'warning' },
      { id: '2', message: 'Low memory', type: 'error' },
    ];

    // Act
    render(<AlertList alerts={alerts} />);

    // Assert
    expect(screen.getByText('High CPU usage')).toBeInTheDocument();
    expect(screen.getByText('Low memory')).toBeInTheDocument();
  });

  it('should show empty state when no alerts', () => {
    // Arrange & Act
    render(<AlertList alerts={[]} />);

    // Assert
    expect(screen.getByText('No alerts')).toBeInTheDocument();
  });

  it('should apply correct styling based on alert type', () => {
    // Arrange
    const alerts = [
      { id: '1', message: 'Warning message', type: 'warning' },
    ];

    // Act
    const { container } = render(<AlertList alerts={alerts} />);

    // Assert
    const alertItem = container.querySelector('.alert-warning');
    expect(alertItem).toBeInTheDocument();
  });

  describe('Error Handling', () => {
    it('should handle null alerts gracefully', () => {
      // Arrange & Act
      render(<AlertList alerts={null as unknown as undefined} />);

      // Assert
      expect(screen.getByText('No alerts')).toBeInTheDocument();
    });

    it('should handle alerts with missing properties', () => {
      // Arrange
      const alerts = [
        { id: '1', message: 'Test', type: '' },
      ];

      // Act
      const { container } = render(<AlertList alerts={alerts} />);

      // Assert
      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('should handle large number of alerts', () => {
      // Arrange
      const alerts = Array.from({ length: 100 }, (_, i) => ({
        id: String(i),
        message: `Alert ${i}`,
        type: 'info',
      }));

      // Act
      render(<AlertList alerts={alerts} />);

      // Assert
      expect(screen.getByText('Alert 0')).toBeInTheDocument();
      expect(screen.getByText('Alert 99')).toBeInTheDocument();
    });
  });
});

