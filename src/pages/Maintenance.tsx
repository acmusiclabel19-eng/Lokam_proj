import React, { useEffect, useState } from 'react';
import { Plus, Wrench, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import api from '../api/client';
import type { Maintenance as MaintenanceType } from '../types';

const Maintenance: React.FC = () => {
  const [requests, setRequests] = useState<MaintenanceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await api.getMaintenances();
      setRequests(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des demandes');
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      LOW: 'bg-gray-100 text-gray-700',
      MEDIUM: 'bg-blue-100 text-blue-700',
      HIGH: 'bg-orange-100 text-orange-700',
      URGENT: 'bg-red-100 text-red-700'
    };
    return colors[priority] || colors.LOW;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'IN_PROGRESS':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Maintenance</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {requests.length} demandes enregistrées
          </p>
        </div>
        <button
          onClick={() => {/* Open modal */}}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white 
            rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nouvelle demande
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((request) => (
          <div
            key={request.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                <Wrench className="w-5 h-5 text-orange-600" />
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                {request.priority}
              </span>
            </div>

            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              {request.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {request.description}
            </p>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              {getStatusIcon(request.status)}
              <span>{request.status}</span>
            </div>

            {request.property && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500">
                  {request.property.name}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {requests.length === 0 && (
        <div className="text-center py-12">
          <Wrench className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Aucune demande de maintenance</p>
        </div>
      )}
    </div>
  );
};

export default Maintenance;
