/**
 * ReportCategoryCard Component Stories
 * 
 * @storybook
 */

import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { 
  MessageCircle, 
  Activity, 
  TrendingUp, 
  Clock,
  Users,
  BarChart,
  DollarSign,
  AlertTriangle,
  Smile
} from 'lucide-react';

// Mock component since actual implementation may vary
const ReportCategoryCard = ({ 
  title,
  description,
  icon: Icon,
  stats,
  onClick,
  color = 'blue'
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  stats?: { label: string; value: string | number }[];
  onClick?: () => void;
  color?: 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'indigo';
}) => {
  const colorClasses = {
    blue: 'bg-blue-500 hover:bg-blue-600',
    purple: 'bg-purple-500 hover:bg-purple-600',
    green: 'bg-green-500 hover:bg-green-600',
    orange: 'bg-orange-500 hover:bg-orange-600',
    red: 'bg-red-500 hover:bg-red-600',
    indigo: 'bg-indigo-500 hover:bg-indigo-600',
  };

  return (
    <div 
      className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
      
      {stats && stats.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
          {stats.map((stat, index) => (
            <div key={index}>
              <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{stat.value}</p>
            </div>
          ))}
        </div>
      )}
      
      <button className="mt-4 w-full py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
        Detayları Gör
      </button>
    </div>
  );
};

const meta = {
  title: 'Admin/Reports/ReportCategoryCard',
  component: ReportCategoryCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Report category card component displaying summary statistics and navigation to detailed reports.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['blue', 'purple', 'green', 'orange', 'red', 'indigo'],
      description: 'Icon background color',
    },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof ReportCategoryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// ==================== REPORT CATEGORIES ====================

export const AIPerformance: Story = {
  args: {
    title: 'AI Performansı',
    description: 'Yapay zeka başarı oranları ve intent analizi',
    icon: Activity,
    color: 'purple',
    stats: [
      { label: 'Başarı Oranı', value: '%87.5' },
      { label: 'Toplam İşlem', value: '12,458' },
    ],
  },
};

export const ChannelAnalysis: Story = {
  args: {
    title: 'Kanal Analizi',
    description: 'WhatsApp, Instagram, Web ve telefon istatistikleri',
    icon: MessageCircle,
    color: 'blue',
    stats: [
      { label: 'En Popüler', value: 'WhatsApp' },
      { label: 'Toplam Kanal', value: '4' },
    ],
  },
};

export const CustomerSatisfaction: Story = {
  args: {
    title: 'Müşteri Memnuniyeti',
    description: 'NPS, CSAT ve detaylı geri bildirim analizi',
    icon: Smile,
    color: 'green',
    stats: [
      { label: 'Ortalama Puan', value: '4.8/5' },
      { label: 'Geri Bildirim', value: '1,234' },
    ],
  },
};

export const TimeAnalysis: Story = {
  args: {
    title: 'Zaman Analizi',
    description: 'Yanıt süreleri ve çözüm süreleri raporu',
    icon: Clock,
    color: 'orange',
    stats: [
      { label: 'Ort. Yanıt', value: '1.2dk' },
      { label: 'Ort. Çözüm', value: '8.5dk' },
    ],
  },
};

export const TeamPerformance: Story = {
  args: {
    title: 'Ekip Performansı',
    description: 'Temsilci bazlı performans metrikleri',
    icon: Users,
    color: 'indigo',
    stats: [
      { label: 'Aktif Temsilci', value: '24' },
      { label: 'En İyi Performans', value: 'Ahmet K.' },
    ],
  },
};

export const ConversionRates: Story = {
  args: {
    title: 'Dönüşüm Oranları',
    description: 'Müşteri kazanımı ve satış hunisi analizi',
    icon: TrendingUp,
    color: 'green',
    stats: [
      { label: 'Dönüşüm', value: '%47.3' },
      { label: 'Yeni Müşteri', value: '856' },
    ],
  },
};

export const FinancialReports: Story = {
  args: {
    title: 'Finansal Raporlar',
    description: 'Gelir, maliyet ve ROI analizi',
    icon: DollarSign,
    color: 'green',
    stats: [
      { label: 'Toplam Gelir', value: '₺284,500' },
      { label: 'ROI', value: '%156' },
    ],
  },
};

export const TrendsAnalysis: Story = {
  args: {
    title: 'Trendler & Tahminler',
    description: 'Veri odaklı tahminler ve trend analizi',
    icon: BarChart,
    color: 'purple',
    stats: [
      { label: 'Büyüme Trendi', value: '+%18.5' },
      { label: 'Tahmin Doğruluğu', value: '%92' },
    ],
  },
};

export const SLAReports: Story = {
  args: {
    title: 'Acil Durum & SLA',
    description: 'SLA ihlalleri ve kritik durum raporları',
    icon: AlertTriangle,
    color: 'red',
    stats: [
      { label: 'SLA Uyumu', value: '%98.2' },
      { label: 'Kritik Durum', value: '3' },
    ],
  },
};

// ==================== STATES ====================

export const WithoutStats: Story = {
  args: {
    title: 'Basit Kart',
    description: 'İstatistik olmadan sadece başlık ve açıklama',
    icon: MessageCircle,
    color: 'blue',
  },
};

export const LongDescription: Story = {
  args: {
    title: 'Uzun Açıklama',
    description: 'Bu kart çok uzun bir açıklama metnine sahip. Açıklama birden fazla satıra yayılabilir ve kartın düzenini test etmek için kullanılır.',
    icon: Activity,
    color: 'purple',
    stats: [
      { label: 'Metrik 1', value: '1,234' },
      { label: 'Metrik 2', value: '5,678' },
    ],
  },
};

export const ManyStats: Story = {
  args: {
    title: 'Çok Sayıda İstatistik',
    description: '4 farklı istatistik gösterimi',
    icon: BarChart,
    color: 'indigo',
    stats: [
      { label: 'İstatistik 1', value: '1,234' },
      { label: 'İstatistik 2', value: '5,678' },
      { label: 'İstatistik 3', value: '9,012' },
      { label: 'İstatistik 4', value: '3,456' },
    ],
  },
};

export const LargeNumbers: Story = {
  args: {
    title: 'Büyük Sayılar',
    description: 'Çok büyük sayılarla kart düzeni testi',
    icon: DollarSign,
    color: 'green',
    stats: [
      { label: 'Toplam', value: '₺1,234,567,890' },
      { label: 'Ortalama', value: '₺987,654' },
    ],
  },
};

// ==================== DARK MODE ====================

export const DarkMode: Story = {
  args: {
    title: 'Dark Mode Test',
    description: 'Karanlık tema görünümü',
    icon: MessageCircle,
    color: 'blue',
    stats: [
      { label: 'Metrik 1', value: '1,234' },
      { label: 'Metrik 2', value: '5,678' },
    ],
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
};

// ==================== GRID LAYOUTS ====================

export const Grid2Columns: Story = {
  args: {
    title: 'Grid Layout',
    description: 'Example grid',
    icon: MessageCircle,
  },
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <ReportCategoryCard
        title="AI Performansı"
        description="Yapay zeka analizi"
        icon={Activity}
        color="purple"
        stats={[{ label: 'Başarı', value: '%87.5' }]}
        onClick={fn()}
      />
      <ReportCategoryCard
        title="Kanal Analizi"
        description="Tüm kanallar"
        icon={MessageCircle}
        color="blue"
        stats={[{ label: 'Toplam', value: '12,458' }]}
        onClick={fn()}
      />
    </div>
  ),
};

export const Grid3Columns: Story = {
  args: {
    title: 'Grid Layout',
    description: 'Example grid',
    icon: MessageCircle,
  },
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <ReportCategoryCard
        title="AI"
        description="Performans"
        icon={Activity}
        color="purple"
        onClick={fn()}
      />
      <ReportCategoryCard
        title="Kanal"
        description="Analiz"
        icon={MessageCircle}
        color="blue"
        onClick={fn()}
      />
      <ReportCategoryCard
        title="Memnuniyet"
        description="CSAT"
        icon={Smile}
        color="green"
        onClick={fn()}
      />
    </div>
  ),
};

// ==================== RESPONSIVE ====================

export const Mobile: Story = {
  args: {
    title: 'Mobil Görünüm',
    description: 'Mobil cihazlarda kart görünümü',
    icon: MessageCircle,
    color: 'blue',
    stats: [
      { label: 'Metrik 1', value: '1,234' },
      { label: 'Metrik 2', value: '5,678' },
    ],
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const Tablet: Story = {
  args: {
    title: 'Tablet Görünüm',
    description: 'Tablet cihazlarda kart görünümü',
    icon: MessageCircle,
    color: 'blue',
    stats: [
      { label: 'Metrik 1', value: '1,234' },
      { label: 'Metrik 2', value: '5,678' },
    ],
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

// ==================== INTERACTIONS ====================

export const WithHoverEffect: Story = {
  args: {
    title: 'Hover Efekti',
    description: 'Fareyle üzerine gelin',
    icon: MessageCircle,
    color: 'blue',
    stats: [
      { label: 'Metrik', value: '1,234' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Hover durumunda shadow artışı ve renk değişimi.',
      },
    },
  },
};

export const Clickable: Story = {
  args: {
    title: 'Tıklanabilir Kart',
    description: 'Karta tıklayarak detaylara gidin',
    icon: MessageCircle,
    color: 'blue',
    stats: [
      { label: 'Metrik', value: '1,234' },
    ],
    onClick: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Tıklama olayı tetiklenir.',
      },
    },
  },
};

