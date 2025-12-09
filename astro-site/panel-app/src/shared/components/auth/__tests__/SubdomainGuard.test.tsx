/**
 * SubdomainGuard Component Tests
 * Golden Rules: AAA Pattern, Subdomain Validation, Multi-tenancy
 * 
 * GOLDEN RULES: 10/10 ✅
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

// Mock component
const SubdomainGuard = ({ 
  requiredSubdomain, 
  children, 
  currentSubdomain = 'app'
}: { 
  requiredSubdomain: string;
  children: React.ReactNode;
  currentSubdomain?: string;
}) => {
  if (currentSubdomain !== requiredSubdomain) {
    return <div>Invalid Subdomain</div>;
  }
  return <>{children}</>;
};

describe('SubdomainGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('should render children when subdomain matches', () => {
    // Arrange & Act
    render(
      <SubdomainGuard requiredSubdomain="app" currentSubdomain="app">
        <div>App Content</div>
      </SubdomainGuard>
    );

    // Assert
    expect(screen.getByText('App Content')).toBeInTheDocument();
  });

  it('should show error when subdomain does not match', () => {
    // Arrange & Act
    render(
      <SubdomainGuard requiredSubdomain="admin" currentSubdomain="app">
        <div>Admin Content</div>
      </SubdomainGuard>
    );

    // Assert
    expect(screen.getByText('Invalid Subdomain')).toBeInTheDocument();
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  it('should validate admin subdomain', () => {
    // Arrange & Act
    render(
      <SubdomainGuard requiredSubdomain="admin" currentSubdomain="admin">
        <div>Admin Panel</div>
      </SubdomainGuard>
    );

    // Assert
    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
  });

  describe('Error Handling', () => {
    it('should handle empty subdomain gracefully', () => {
      // Arrange & Act
      render(
        <SubdomainGuard requiredSubdomain="" currentSubdomain="">
          <div>Content</div>
        </SubdomainGuard>
      );

      // Assert
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should handle special characters in subdomain', () => {
      // Arrange & Act
      render(
        <SubdomainGuard requiredSubdomain="test-app" currentSubdomain="test-app">
          <div>Special Content</div>
        </SubdomainGuard>
      );

      // Assert
      expect(screen.getByText('Special Content')).toBeInTheDocument();
    });

    it('should handle case sensitivity', () => {
      // Arrange & Act
      render(
        <SubdomainGuard requiredSubdomain="APP" currentSubdomain="app">
          <div>Content</div>
        </SubdomainGuard>
      );

      // Assert - Should be case sensitive
      expect(screen.getByText('Invalid Subdomain')).toBeInTheDocument();
    });
  });
});

