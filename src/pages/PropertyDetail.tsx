import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, MapPin, Home, DollarSign, Users } from 'lucide-react';
import { toast } from 'sonner';
import api from '../api/client';
import type { Property } from '../types';

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchProperty(id);
    }
  }, [id]);

  const fetchProperty = async (propertyId: string) => {
    try {
      const data = await api.getProperty(propertyId);
      setProperty(data);
    } catch (error) {
      toast.error('Erreur lors du chargement du bien');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce bien ?')) return;
    
    try {
      await api.deleteProperty(id!);
      toast.success('Bien supprimé avec succès');
      navigate('/properties');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Bien non trouvé</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/properties')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{property.name}</h1>
          <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {property.address}, {property.commune}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/properties/${id}/edit`)}
            className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-200"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 hover:bg-red-200"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <Home className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <p className="font-medium text-gray-900 dark:text-white">{property.type}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Loyer mensuel</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {property.monthlyRent.toLocaleString()} FCFA
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Statut</p>
              <p className="font-medium text-gray-900 dark:text-white">{property.status}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Caractéristiques
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Surface</p>
            <p className="font-medium text-gray-900 dark:text-white">{property.surface || 'N/A'} m²</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Pièces</p>
            <p className="font-medium text-gray-900 dark:text-white">{property.rooms || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Chambres</p>
            <p className="font-medium text-gray-900 dark:text-white">{property.bedrooms || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Salles de bain</p>
            <p className="font-medium text-gray-900 dark:text-white">{property.bathrooms || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Financial Model */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Modèle financier
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-500">Caution</p>
            <p className="font-medium text-gray-900 dark:text-white">{property.depositMonths} mois</p>
            <p className="text-sm text-gray-400">
              {(property.monthlyRent * property.depositMonths).toLocaleString()} FCFA
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-500">Avance</p>
            <p className="font-medium text-gray-900 dark:text-white">{property.advanceMonths} mois</p>
            <p className="text-sm text-gray-400">
              {(property.monthlyRent * property.advanceMonths).toLocaleString()} FCFA
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-500">Frais</p>
            <p className="font-medium text-gray-900 dark:text-white">{property.feeMonths} mois</p>
            <p className="text-sm text-gray-400">
              {(property.monthlyRent * property.feeMonths).toLocaleString()} FCFA
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
