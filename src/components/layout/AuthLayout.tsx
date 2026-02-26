import React from 'react';
import { Outlet } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const AuthLayout: React.FC = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 items-center justify-center p-12">
          <div className="max-w-md text-white">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold">LOKAM</span>
            </div>
            <h1 className="text-4xl font-bold mb-6">
              Gérez votre patrimoine immobilier en toute simplicité
            </h1>
            <p className="text-lg text-blue-100 mb-8">
              La plateforme de gestion immobilière collaborative adaptée au marché ivoirien. 
              Louez, gérez et encaissez en toute sérénité.
            </p>
            <div className="flex gap-8">
              <div>
                <div className="text-3xl font-bold">25+</div>
                <div className="text-blue-200">Biens gérés</div>
              </div>
              <div>
                <div className="text-3xl font-bold">18</div>
                <div className="text-blue-200">Locataires</div>
              </div>
              <div>
                <div className="text-3xl font-bold">3</div>
                <div className="text-blue-200">Agences</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 bg-white dark:bg-gray-900">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">LOKAM</span>
          </div>

          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
