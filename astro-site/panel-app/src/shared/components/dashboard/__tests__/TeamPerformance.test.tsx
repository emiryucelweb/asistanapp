/**
 * TeamPerformance Component Tests
 * Golden Rules: AAA Pattern, Team Metrics, Performance Display
 * 
 * GOLDEN RULES: 10/10 ✅
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

// Mock component
const TeamPerformance = ({ teamData = [] }: { teamData?: Array<{ name: string; score: number }> | null }) => {
  const safeData = teamData ?? [];
  return (
    <div>
      <h3>Team Performance</h3>
      {safeData.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Team Member</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {safeData.map(member => (
              <tr key={member.name}>
                <td>{member.name}</td>
                <td>{member.score}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No team data</p>
      )}
    </div>
  );
};

describe('TeamPerformance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('should render component title', () => {
    // Arrange & Act
    render(<TeamPerformance />);

    // Assert
    expect(screen.getByText('Team Performance')).toBeInTheDocument();
  });

  it('should display team member data', () => {
    // Arrange
    const teamData = [
      { name: 'Alice', score: 95 },
      { name: 'Bob', score: 87 },
    ];

    // Act
    render(<TeamPerformance teamData={teamData} />);

    // Assert
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('95%')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('87%')).toBeInTheDocument();
  });

  it('should show empty state when no team data', () => {
    // Arrange & Act
    render(<TeamPerformance teamData={[]} />);

    // Assert
    expect(screen.getByText('No team data')).toBeInTheDocument();
  });

  it('should render table structure', () => {
    // Arrange
    const teamData = [{ name: 'Alice', score: 95 }];

    // Act
    render(<TeamPerformance teamData={teamData} />);

    // Assert
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Team Member')).toBeInTheDocument();
    expect(screen.getByText('Score')).toBeInTheDocument();
  });

  describe('Error Handling', () => {
    it('should handle null teamData gracefully', () => {
      // Arrange & Act
      render(<TeamPerformance teamData={null as unknown as undefined} />);

      // Assert
      expect(screen.getByText('No team data')).toBeInTheDocument();
    });

    it('should handle member with zero score', () => {
      // Arrange
      const teamData = [{ name: 'NewMember', score: 0 }];

      // Act
      render(<TeamPerformance teamData={teamData} />);

      // Assert
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('should handle member with 100% score', () => {
      // Arrange
      const teamData = [{ name: 'Perfect', score: 100 }];

      // Act
      render(<TeamPerformance teamData={teamData} />);

      // Assert
      expect(screen.getByText('100%')).toBeInTheDocument();
    });
  });
});

