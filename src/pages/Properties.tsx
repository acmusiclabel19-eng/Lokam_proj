import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Building2, MapPin, Users } from 'lucide-react';
import { toast } from 'sonner';
import api from '../api/client';
import type { Property } from '../types';

const Properties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const data = await api.getProperties();
      setProperties(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des biens');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProperties = properties.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.address.toLowerCase().includes(search.toLowerCase()) ||
      p.commune.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = filter === 'ALL' || p.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      VACANT: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      OCCUPIED: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
      MAINTENANCE: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
      RESERVED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
    };
    const labels: Record<string, string> = {
      VACANT: 'Vacant',
      OCCUPIED: 'Occupé',
      MAINTENANCE: 'Maintenance',
      RESERVED: 'Réservé'
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Biens immobiliers</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {properties.length} biens enregistrés
          </p>
        </div>
        <button
          onClick={() => navigate('/properties/new')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white 
            rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Ajouter un bien
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un bien..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
              bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="ALL">Tous les statuts</option>
          <option value="VACANT">Vacant</option>
          <option value="OCCUPIED">Occupé</option>
          <option value="MAINTENANCE">Maintenance</option>
          <option value="RESERVED">Réservé</option>
        </select>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <div
            key={property.id}
            onClick={() => navigate(`/properties/${property.id}`)}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 
              dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                {getStatusBadge(property.status)}
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {property.name}
              </h3>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {property.address}, {property.commune}
                </div>
                {property.tenant && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {property.tenant.user.firstName} {property.tenant.user.lastName}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Loyer mensuel</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {property.monthlyRent.toLocaleString()} FCFA
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Aucun bien trouvé</p>
        </div>
      )}
    </div>
  );
};

export default Properties;
