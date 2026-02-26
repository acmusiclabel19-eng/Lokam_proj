import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Briefcase, Home } from 'lucide-react';
import { toast } from 'sonner';
import api from '../api/client';
import type { TenantProfile } from '../types';

interface TenantWithDetails extends TenantProfile {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };
  leases: any[];
  payments: any[];
}

const TenantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tenant, setTenant] = useState<TenantWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchTenant(id);
    }
  }, [id]);

  const fetchTenant = async (tenantId: string) => {
    try {
      const data = await api.getTenant(tenantId);
      setTenant(data);
    } catch (error) {
      toast.error('Erreur lors du chargement du locataire');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Locataire non trouvé</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/tenants')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-semibold">
            {tenant.user.firstName[0]}{tenant.user.lastName[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {tenant.user.firstName} {tenant.user.lastName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{tenant.profession || 'Profession non renseignée'}</p>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <Mail className="w-5 h-5" />
              {tenant.user.email}
            </div>
            {tenant.user.phone && (
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Phone className="w-5 h-5" />
                {tenant.user.phone}
              </div>
            )}
            {tenant.employer && (
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Briefcase className="w-5 h-5" />
                {tenant.employer}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informations</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Revenu mensuel</span>
              <span className="font-medium">{tenant.monthlyIncome?.toLocaleString() || 'N/A'} FCFA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Pièce d'identité</span>
              <span className="font-medium">{tenant.idNumber || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Contact d'urgence</span>
              <span className="font-medium">{tenant.emergencyContact || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Leases */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Baux</h2>
        {tenant.leases.length === 0 ? (
          <p className="text-gray-500">Aucun bail enregistré</p>
        ) : (
          <div className="space-y-4">
            {tenant.leases.map((lease) => (
              <div key={lease.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Home className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{lease.property?.name}</span>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(lease.startDate).toLocaleDateString('fr-FR')} - {new Date(lease.endDate).toLocaleDateString('fr-FR')}
                </p>
                <p className="text-sm text-gray-500">{lease.monthlyRent.toLocaleString()} FCFA/mois</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantDetail;
