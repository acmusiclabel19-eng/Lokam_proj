import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center px-4">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-yellow-100 dark:bg-yellow-900/20">
            <AlertTriangle className="w-16 h-16 text-yellow-600" />
          </div>
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Page non trouvée
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 
            text-white font-medium rounded-lg transition-colors"
        >
          <Home className="w-5 h-5" />
          Retour au tableau de bord
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
