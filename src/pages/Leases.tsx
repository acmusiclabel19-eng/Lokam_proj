import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import api from '../api/client';
import type { Lease } from '../types';

const Leases: React.FC = () => {
  const [leases, setLeases] = useState<Lease[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeases();
  }, []);

  const fetchLeases = async () => {
    try {
      const data = await api.getLeases();
      setLeases(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des baux');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      ACTIVE: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
      EXPIRED: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      TERMINATED: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
      PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
    };
    const labels: Record<string, string> = {
      ACTIVE: 'Actif',
      EXPIRED: 'Expiré',
      TERMINATED: 'Terminé',
      PENDING: 'En attente'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Baux</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {leases.length} baux enregistrés
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Bien
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Locataire
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Période
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Loyer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {leases.map((lease) => (
                <tr key={lease.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {lease.property?.name}
                    </p>
                    <p className="text-sm text-gray-500">{lease.property?.address}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900 dark:text-white">
                      {lease.tenant?.firstName} {lease.tenant?.lastName}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(lease.startDate).toLocaleDateString('fr-FR')} - {new Date(lease.endDate).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {lease.monthlyRent.toLocaleString()} FCFA
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(lease.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leases;
