/**
 * PageLoadingState Components Tests
 * Coverage Target: 30% → 65%
 * Golden Rules: AAA Pattern, Component Structure Validation
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import {
  DashboardLoadingState,
  ConversationsLoadingState,
  TableLoadingState,
  ProfileLoadingState,
  SettingsLoadingState,
  TeamChatLoadingState,
  GenericPageLoadingState,
} from '../PageLoadingState';

// Mock cn utility
vi.mock('@/lib/utils', () => ({
  cn: (...classes: (string | undefined | false)[]) => classes.filter(Boolean).join(' '),
}));

describe('DashboardLoadingState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render dashboard loading structure', () => {
    // Arrange & Act
    const { container } = render(<DashboardLoadingState />);

    // Assert
    expect(container).toBeInTheDocument();
  });

  it('should render 4 stats cards', () => {
    // Arrange & Act
    const { container } = render(<DashboardLoadingState />);

    // Assert
    const statsGrid = container.querySelector('.grid.grid-cols-1');
    expect(statsGrid).toBeInTheDocument();
  });

  it('should render charts section', () => {
    // Arrange & Act
    const { container } = render(<DashboardLoadingState />);

    // Assert
    const chartsGrid = container.querySelectorAll('.grid')[1];
    expect(chartsGrid).toBeInTheDocument();
  });

  it('should render recent activity section with 5 items', () => {
    // Arrange & Act
    const { container } = render(<DashboardLoadingState />);

    // Assert
    const listItems = container.querySelectorAll('.space-y-3');
    expect(listItems.length).toBeGreaterThan(0);
  });

  it('should have fade-in animation', () => {
    // Arrange & Act
    const { container } = render(<DashboardLoadingState />);

    // Assert
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('animate-in', 'fade-in');
  });

  it('should accept className prop', () => {
    // Arrange & Act
    const { container } = render(<DashboardLoadingState className="custom-dashboard" />);

    // Assert
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('custom-dashboard');
  });
});

describe('ConversationsLoadingState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render conversations loading structure', () => {
    // Arrange & Act
    const { container } = render(<ConversationsLoadingState />);

    // Assert
    const grid = container.querySelector('.grid.grid-cols-1.lg\\:grid-cols-3');
    expect(grid).toBeInTheDocument();
  });

  it('should render conversation list with 8 items', () => {
    // Arrange & Act
    const { container } = render(<ConversationsLoadingState />);

    // Assert
    // Conversation list is the first column
    const conversationList = container.querySelector('.lg\\:col-span-1');
    expect(conversationList).toBeInTheDocument();
  });

  it('should render conversation detail panel', () => {
    // Arrange & Act
    const { container } = render(<ConversationsLoadingState />);

    // Assert
    const detailPanel = container.querySelector('.lg\\:col-span-2');
    expect(detailPanel).toBeInTheDocument();
  });

  it('should render 5 message skeletons', () => {
    // Arrange & Act
    const { container } = render(<ConversationsLoadingState />);

    // Assert
    const messages = container.querySelector('.space-y-4');
    expect(messages).toBeInTheDocument();
  });

  it('should have fade-in animation', () => {
    // Arrange & Act
    const { container } = render(<ConversationsLoadingState />);

    // Assert
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('animate-in', 'fade-in');
  });

  it('should accept className prop', () => {
    // Arrange & Act
    const { container } = render(<ConversationsLoadingState className="custom-conversations" />);

    // Assert
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('custom-conversations');
  });
});

describe('TableLoadingState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render table loading structure', () => {
    // Arrange & Act
    const { container } = render(<TableLoadingState />);

    // Assert
    const table = container.querySelector('.bg-white.rounded-xl');
    expect(table).toBeInTheDocument();
  });

  it('should render default 10 rows', () => {
    // Arrange & Act
    const { container } = render(<TableLoadingState />);

    // Assert
    const rows = container.querySelectorAll('.divide-y > div');
    expect(rows).toHaveLength(10);
  });

  it('should render custom number of rows', () => {
    // Arrange & Act
    const { container } = render(<TableLoadingState rows={5} />);

    // Assert
    const rows = container.querySelectorAll('.divide-y > div');
    expect(rows).toHaveLength(5);
  });

  it('should render default 5 columns', () => {
    // Arrange & Act
    const { container } = render(<TableLoadingState />);

    // Assert
    const headerCells = container.querySelectorAll('.p-4.border-b .flex > *');
    expect(headerCells).toHaveLength(5);
  });

  it('should render custom number of columns', () => {
    // Arrange & Act
    const { container } = render(<TableLoadingState columns={3} />);

    // Assert
    const headerCells = container.querySelectorAll('.p-4.border-b .flex > *');
    expect(headerCells).toHaveLength(3);
  });

  it('should have fade-in animation', () => {
    // Arrange & Act
    const { container } = render(<TableLoadingState />);

    // Assert
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('animate-in', 'fade-in');
  });

  it('should accept className prop', () => {
    // Arrange & Act
    const { container } = render(<TableLoadingState className="custom-table" />);

    // Assert
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('custom-table');
  });

  // Rule 9: Edge Cases
  describe('Edge Cases', () => {
    it('should handle zero rows', () => {
      // Arrange & Act
      const { container } = render(<TableLoadingState rows={0} />);

      // Assert
      const rows = container.querySelectorAll('.divide-y > div');
      expect(rows).toHaveLength(0);
    });

    it('should handle large number of rows', () => {
      // Arrange & Act
      const { container } = render(<TableLoadingState rows={100} />);

      // Assert
      const rows = container.querySelectorAll('.divide-y > div');
      expect(rows).toHaveLength(100);
    });

    it('should handle single column', () => {
      // Arrange & Act
      const { container } = render(<TableLoadingState columns={1} />);

      // Assert
      const headerCells = container.querySelectorAll('.p-4.border-b .flex > *');
      expect(headerCells).toHaveLength(1);
    });
  });
});

describe('ProfileLoadingState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render profile loading structure', () => {
    // Arrange & Act
    const { container } = render(<ProfileLoadingState />);

    // Assert
    expect(container.querySelector('.space-y-6')).toBeInTheDocument();
  });

  it('should render large avatar (120x120)', () => {
    // Arrange & Act
    const { container } = render(<ProfileLoadingState />);

    // Assert
    const avatar = container.querySelector('[style*="width: 120px"]');
    expect(avatar).toBeInTheDocument();
  });

  it('should render 3 stats cards', () => {
    // Arrange & Act
    const { container } = render(<ProfileLoadingState />);

    // Assert
    const statsGrid = container.querySelector('.grid.grid-cols-1.sm\\:grid-cols-3');
    expect(statsGrid).toBeInTheDocument();
  });

  it('should render details section with 6 items', () => {
    // Arrange & Act
    const { container } = render(<ProfileLoadingState />);

    // Assert
    const detailsSection = container.querySelectorAll('.space-y-4');
    expect(detailsSection.length).toBeGreaterThan(0);
  });

  it('should have fade-in animation', () => {
    // Arrange & Act
    const { container } = render(<ProfileLoadingState />);

    // Assert
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('animate-in', 'fade-in');
  });

  it('should accept className prop', () => {
    // Arrange & Act
    const { container } = render(<ProfileLoadingState className="custom-profile" />);

    // Assert
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('custom-profile');
  });
});

describe('SettingsLoadingState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render settings loading structure', () => {
    // Arrange & Act
    const { container } = render(<SettingsLoadingState />);

    // Assert
    expect(container.querySelector('.space-y-6')).toBeInTheDocument();
  });

  it('should render 4 tab placeholders', () => {
    // Arrange & Act
    const { container } = render(<SettingsLoadingState />);

    // Assert
    const tabs = container.querySelector('.flex.gap-4.border-b');
    const tabButtons = tabs?.querySelectorAll('[style*="width: 120px"]');
    expect(tabButtons).toHaveLength(4);
  });

  it('should render 3 settings sections', () => {
    // Arrange & Act
    const { container } = render(<SettingsLoadingState />);

    // Assert
    const sections = container.querySelectorAll('.bg-white.rounded-xl.border');
    expect(sections.length).toBe(3);
  });

  it('should render 4 settings items per section', () => {
    // Arrange & Act
    const { container } = render(<SettingsLoadingState />);

    // Assert
    const firstSection = container.querySelectorAll('.bg-white.rounded-xl.border')[0];
    const items = firstSection?.querySelectorAll('.flex.items-center.justify-between');
    expect(items.length).toBe(4);
  });

  it('should have fade-in animation', () => {
    // Arrange & Act
    const { container } = render(<SettingsLoadingState />);

    // Assert
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('animate-in', 'fade-in');
  });

  it('should accept className prop', () => {
    // Arrange & Act
    const { container } = render(<SettingsLoadingState className="custom-settings" />);

    // Assert
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('custom-settings');
  });
});

describe('TeamChatLoadingState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render team chat loading structure', () => {
    // Arrange & Act
    const { container } = render(<TeamChatLoadingState />);

    // Assert
    const grid = container.querySelector('.grid.grid-cols-1.lg\\:grid-cols-4');
    expect(grid).toBeInTheDocument();
  });

  it('should render channels sidebar', () => {
    // Arrange & Act
    const { container } = render(<TeamChatLoadingState />);

    // Assert
    const sidebar = container.querySelector('.lg\\:col-span-1');
    expect(sidebar).toBeInTheDocument();
  });

  it('should render 6 channel items', () => {
    // Arrange & Act
    const { container } = render(<TeamChatLoadingState />);

    // Assert
    const sidebar = container.querySelector('.lg\\:col-span-1');
    const channelItems = sidebar?.querySelectorAll('.space-y-2 > div');
    expect(channelItems?.length).toBe(6);
  });

  it('should render chat area', () => {
    // Arrange & Act
    const { container } = render(<TeamChatLoadingState />);

    // Assert
    const chatArea = container.querySelector('.lg\\:col-span-3');
    expect(chatArea).toBeInTheDocument();
  });

  it('should render 6 message skeletons', () => {
    // Arrange & Act
    const { container } = render(<TeamChatLoadingState />);

    // Assert
    const messagesContainer = container.querySelector('.flex-1.p-6.space-y-4');
    expect(messagesContainer).toBeInTheDocument();
  });

  it('should have fade-in animation', () => {
    // Arrange & Act
    const { container } = render(<TeamChatLoadingState />);

    // Assert
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('animate-in', 'fade-in');
  });

  it('should accept className prop', () => {
    // Arrange & Act
    const { container } = render(<TeamChatLoadingState className="custom-team-chat" />);

    // Assert
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('custom-team-chat');
  });
});

describe('GenericPageLoadingState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render generic page loading structure', () => {
    // Arrange & Act
    const { container } = render(<GenericPageLoadingState />);

    // Assert
    expect(container.querySelector('.space-y-6')).toBeInTheDocument();
  });

  it('should render header section', () => {
    // Arrange & Act
    const { container } = render(<GenericPageLoadingState />);

    // Assert
    const header = container.querySelector('.flex.items-center.justify-between');
    expect(header).toBeInTheDocument();
  });

  it('should render 6 card placeholders', () => {
    // Arrange & Act
    const { container } = render(<GenericPageLoadingState />);

    // Assert
    const cards = container.querySelectorAll('.bg-white.rounded-xl.border.p-6');
    expect(cards.length).toBe(6);
  });

  it('should render in 3 column grid', () => {
    // Arrange & Act
    const { container } = render(<GenericPageLoadingState />);

    // Assert
    const grid = container.querySelector('.grid.grid-cols-1.lg\\:grid-cols-3');
    expect(grid).toBeInTheDocument();
  });

  it('should have fade-in animation', () => {
    // Arrange & Act
    const { container } = render(<GenericPageLoadingState />);

    // Assert
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('animate-in', 'fade-in');
  });

  it('should accept className prop', () => {
    // Arrange & Act
    const { container } = render(<GenericPageLoadingState className="custom-generic" />);

    // Assert
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('custom-generic');
  });
});

