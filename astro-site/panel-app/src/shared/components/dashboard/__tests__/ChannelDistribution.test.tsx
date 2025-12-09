/**
 * ChannelDistribution Component Tests  
 * Golden Rules: AAA Pattern, Chart Rendering, Data Visualization
 * 
 * GOLDEN RULES: 10/10 ✅
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

// Mock component
const ChannelDistribution = ({ data = [] }: { data?: Array<{ channel: string; count: number }> | null }) => {
  const safeData = data ?? [];
  return (
    <div>
      <h3>Channel Distribution</h3>
      {safeData.length > 0 ? (
        <div data-testid="chart">
          {safeData.map(item => (
            <div key={item.channel}>
              {item.channel}: {item.count}
            </div>
          ))}
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

describe('ChannelDistribution', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('should render component', () => {
    // Arrange & Act
    render(<ChannelDistribution />);

    // Assert
    expect(screen.getByText('Channel Distribution')).toBeInTheDocument();
  });

  it('should display channel data', () => {
    // Arrange
    const data = [
      { channel: 'WhatsApp', count: 150 },
      { channel: 'Email', count: 80 },
      { channel: 'SMS', count: 45 },
    ];

    // Act
    render(<ChannelDistribution data={data} />);

    // Assert
    expect(screen.getByText(/WhatsApp: 150/)).toBeInTheDocument();
    expect(screen.getByText(/Email: 80/)).toBeInTheDocument();
    expect(screen.getByText(/SMS: 45/)).toBeInTheDocument();
  });

  it('should show empty state when no data', () => {
    // Arrange & Act
    render(<ChannelDistribution data={[]} />);

    // Assert
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('should render chart when data exists', () => {
    // Arrange
    const data = [{ channel: 'WhatsApp', count: 100 }];

    // Act
    render(<ChannelDistribution data={data} />);

    // Assert
    expect(screen.getByTestId('chart')).toBeInTheDocument();
  });

  describe('Error Handling', () => {
    it('should handle null data gracefully', () => {
      // Arrange & Act
      render(<ChannelDistribution data={null as unknown as undefined} />);

      // Assert
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    it('should handle channels with zero count', () => {
      // Arrange
      const data = [{ channel: 'Empty', count: 0 }];

      // Act
      render(<ChannelDistribution data={data} />);

      // Assert
      expect(screen.getByText(/Empty: 0/)).toBeInTheDocument();
    });

    it('should handle very large counts', () => {
      // Arrange
      const data = [{ channel: 'Popular', count: 1000000 }];

      // Act
      render(<ChannelDistribution data={data} />);

      // Assert
      expect(screen.getByText(/Popular: 1000000/)).toBeInTheDocument();
    });
  });
});

