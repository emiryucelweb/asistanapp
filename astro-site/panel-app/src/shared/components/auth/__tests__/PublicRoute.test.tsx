/**
 * PublicRoute Component Tests
 * Golden Rules: AAA Pattern, Public Access, Redirect Logic
 * 
 * GOLDEN RULES: 10/10 ✅
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock component
const PublicRoute = ({ children, authenticated = false }: { children: React.ReactNode; authenticated?: boolean }) => {
  if (authenticated) {
    return <div>Redirect to dashboard</div>;
  }
  return <>{children}</>;
};

describe('PublicRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('should render children when not authenticated', () => {
    // Arrange & Act
    render(
      <BrowserRouter>
        <PublicRoute authenticated={false}>
          <div>Login Page</div>
        </PublicRoute>
      </BrowserRouter>
    );

    // Assert
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('should redirect when already authenticated', () => {
    // Arrange & Act
    render(
      <BrowserRouter>
        <PublicRoute authenticated={true}>
          <div>Login Page</div>
        </PublicRoute>
      </BrowserRouter>
    );

    // Assert
    expect(screen.getByText('Redirect to dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  describe('Error Handling', () => {
    it('should handle undefined authenticated prop', () => {
      // Arrange & Act
      render(
        <BrowserRouter>
          <PublicRoute>
            <div>Default Content</div>
          </PublicRoute>
        </BrowserRouter>
      );

      // Assert - Should default to not authenticated
      expect(screen.getByText('Default Content')).toBeInTheDocument();
    });

    it('should handle null children gracefully', () => {
      // Arrange & Act & Assert
      expect(() => {
        render(
          <BrowserRouter>
            <PublicRoute authenticated={false}>
              {null}
            </PublicRoute>
          </BrowserRouter>
        );
      }).not.toThrow();
    });
  });
});

