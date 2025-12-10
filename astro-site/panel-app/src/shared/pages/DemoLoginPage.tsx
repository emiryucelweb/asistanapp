import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';

const DemoLoginPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // SHA-256 hash of the demo password (AsistanApp2025)
  const TARGET_HASH = '5283d2ebf22e694681ac4fb8aec48d434327b8a84b82ac4627f2c96722d69981';

  const hashPassword = async (pwd: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(pwd);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Trim password to remove accidental whitespace
      const cleanPassword = password.trim();
      const hashedPassword = await hashPassword(cleanPassword);
      
      console.log('Input Password Length:', cleanPassword.length);
      console.log('Generated Hash:', hashedPassword);
      console.log('Target Hash:   ', TARGET_HASH);
      console.log('Match:', hashedPassword === TARGET_HASH);
      
      if (hashedPassword === TARGET_HASH) {
        sessionStorage.setItem('isDemoAuthenticated', 'true');
        navigate('/');
      } else {
        setError('Hatalı şifre');
      }
    } catch (err) {
      console.error('Hashing error:', err);
      setError('Bir hata oluştu');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Demo Erişimi</h1>
          <p className="text-gray-400">Devam etmek için lütfen demo şifresini giriniz.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifre"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
};

export default DemoLoginPage;
