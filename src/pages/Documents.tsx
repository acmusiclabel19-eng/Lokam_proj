import React from 'react';
import { FileText, Download, FileSpreadsheet, AlertCircle } from 'lucide-react';
import api from '../api/client';

const Documents: React.FC = () => {
  const documents = [
    {
      name: 'Contrats de bail',
      description: 'Générer des contrats de bail pour vos locataires',
      icon: FileText,
      action: 'Sélectionner un bail'
    },
    {
      name: 'Quittances',
      description: 'Télécharger les quittances de loyer',
      icon: FileSpreadsheet,
      action: 'Voir les paiements'
    },
    {
      name: 'Rapport financier',
      description: 'Rapport annuel de vos revenus',
      icon: FileSpreadsheet,
      action: () => window.open(api.getFinancialReportUrl(), '_blank')
    },
    {
      name: 'Lettres de relance',
      description: 'Générer des lettres de relance pour loyers impayés',
      icon: AlertCircle,
      action: 'Sélectionner un locataire'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Documents</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Générez et téléchargez vos documents officiels
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {documents.map((doc, index) => {
          const Icon = doc.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{doc.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {doc.description}
                  </p>
                  <button
                    onClick={typeof doc.action === 'function' ? doc.action : undefined}
                    className="mt-4 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Download className="w-4 h-4" />
                    {typeof doc.action === 'string' ? doc.action : 'Télécharger'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Documents;
