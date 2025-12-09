import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Headphones, Shield } from 'lucide-react';

export const PanelSelector: React.FC = () => {
  const navigate = useNavigate();

  const panels = [
    {
      id: 'admin',
      title: 'İşletme Sahibi (Admin)',
      description: 'Müşteri yönetimi, sohbet analizi ve raporlar',
      icon: Users,
      path: '/admin/login',
      color: 'bg-blue-500',
      accent: 'from-blue-600 to-blue-400',
    },
    {
      id: 'agent',
      title: 'Temsilci (Agent)',
      description: 'Sohbet yönetimi ve müşteri iletişimi',
      icon: Headphones,
      path: '/agent/login',
      color: 'bg-green-500',
      accent: 'from-green-600 to-green-400',
    },
    {
      id: 'super-admin',
      title: 'Super Admin',
      description: 'Sistem yönetimi ve işletme yönetimi',
      icon: Shield,
      path: '/asistansuper/login',
      color: 'bg-purple-500',
      accent: 'from-purple-600 to-purple-400',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            AsistanApp Panel
          </h1>
          <p className="text-xl text-gray-300">
            Lütfen erişmek istediğiniz paneli seçin
          </p>
        </div>

        {/* Panel Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {panels.map((panel) => {
            const IconComponent = panel.icon;
            return (
              <button
                key={panel.id}
                onClick={() => navigate(panel.path)}
                className="group relative bg-gray-800 rounded-xl p-8 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer transform hover:-translate-y-2"
              >
                {/* Gradient border on hover */}
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${panel.accent} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                {/* Content */}
                <div className="relative z-10 space-y-6">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-xl ${panel.color} bg-opacity-20 flex items-center justify-center`}>
                    <IconComponent className={`w-8 h-8 ${panel.color.replace('bg-', 'text-')}`} />
                  </div>

                  {/* Title & Description */}
                  <div className="text-left">
                    <h2 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {panel.title}
                    </h2>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {panel.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="pt-4 flex items-center text-blue-400 group-hover:translate-x-2 transition-transform">
                    <span className="text-sm font-semibold">Devam Et</span>
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Hover effect background */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            );
          })}
        </div>

        {/* Demo info */}
        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>Bu bir demo ortamıdır. Herhangi bir gerçek veri değişmez.</p>
        </div>
      </div>
    </div>
  );
};

export default PanelSelector;
