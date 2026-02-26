import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Download } from 'lucide-react';
import { toast } from 'sonner';
import api from '../api/client';
import type { Payment } from '../types';

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const data = await api.getPayments();
      setPayments(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des paiements');
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidate = async (id: string, status: 'VALIDATED' | 'REJECTED') => {
    try {
      await api.validatePayment(id, status);
      toast.success(status === 'VALIDATED' ? 'Paiement validé' : 'Paiement rejeté');
      fetchPayments();
    } catch (error) {
      toast.error('Erreur lors de la validation');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      VALIDATED: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
      REJECTED: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
      PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
    };
    const labels: Record<string, string> = {
      VALIDATED: 'Validé',
      REJECTED: 'Rejeté',
      PENDING: 'En attente'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const filteredPayments = payments.filter(p => 
    filter === 'ALL' || p.status === filter
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Paiements</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {payments.length} paiements enregistrés
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="ALL">Tous les statuts</option>
          <option value="PENDING">En attente</option>
          <option value="VALIDATED">Validés</option>
          <option value="REJECTED">Rejetés</option>
        </select>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Locataire
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Période
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Méthode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {payment.tenant?.firstName} {payment.tenant?.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{payment.property?.name}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {payment.month}/{payment.year}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {payment.amount.toLocaleString()} FCFA
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {payment.method}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="px-6 py-4">
                    {payment.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleValidate(payment.id, 'VALIDATED')}
                          className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200"
                          title="Valider"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleValidate(payment.id, 'REJECTED')}
                          className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                          title="Rejeter"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    {payment.status === 'VALIDATED' && payment.quittanceNumber && (
                      <a
                        href={api.getQuittanceUrl(payment.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 inline-flex"
                        title="Télécharger la quittance"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    )}
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

export default Payments;
