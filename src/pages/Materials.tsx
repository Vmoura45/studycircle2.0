import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../lib/store';
import { FileText, Image, BookOpen, Plus, AlertCircle, Search, Filter, ShoppingCart, Star, TrendingUp, Clock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function MaterialIcon({ type }: { type: 'image' | 'text' | 'lesson_plan' }) {
  switch (type) {
    case 'image':
      return <Image className="h-5 w-5 text-gray-600" />;
    case 'text':
      return <FileText className="h-5 w-5 text-gray-600" />;
    case 'lesson_plan':
      return <BookOpen className="h-5 w-5 text-gray-600" />;
  }
}

export default function Materials() {
  const navigate = useNavigate();
  const { 
    user, 
    materials, 
    categories, 
    transactions, 
    fetchMaterials,
    fetchCategories,
    fetchUserTransactions
  } = useAuthStore();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        await Promise.all([
          fetchMaterials(),
          fetchCategories(),
          user ? fetchUserTransactions() : Promise.resolve()
        ]);
      } catch (err) {
        console.error('Error loading materials:', err);
        setError(err instanceof Error ? err.message : 'Failed to load materials');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, fetchMaterials, fetchCategories, fetchUserTransactions]);

  const hasPurchased = (materialId: string) => {
    return transactions.some(t => t.material_id === materialId);
  };

  const filteredMaterials = materials
    .filter(material => {
      if (selectedCategory && material.category_id !== selectedCategory) {
        return false;
      }
      if (searchQuery && !material.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (priceFilter === 'free' && material.price > 0) {
        return false;
      }
      if (priceFilter === 'paid' && material.price === 0) {
        return false;
      }
      return true;
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading materials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Educational Materials</h1>
          {user?.user_type === 'creator' && (
            <button
              onClick={() => navigate('/materials/new')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Create Material
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value as 'all' | 'free' | 'paid')}
            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Prices</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </div>

      {filteredMaterials.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No materials found</h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <div
              key={material.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <MaterialIcon type={material.material_type} />
                  <span className="capitalize text-gray-600">{material.material_type}</span>
                </div>
                {material.categories && (
                  <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {material.categories.name}
                  </span>
                )}
              </div>

              <h3 className="text-xl font-semibold mb-2">{material.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{material.description}</p>

              <div className="flex items-center gap-4 mb-4">
                {material.avg_rating && (
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="ml-1 text-sm text-gray-600">
                      {material.avg_rating.toFixed(1)}
                    </span>
                  </div>
                )}
                {material.total_reviews > 0 && (
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-gray-400" />
                    <span className="ml-1 text-sm text-gray-600">
                      {material.total_reviews} reviews
                    </span>
                  </div>
                )}
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="ml-1 text-sm text-gray-600">
                    {new Date(material.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {material.creator && (
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>{material.creator.full_name || material.creator.email}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-indigo-600">
                  {material.price === 0 ? 'Free' : `$${material.price}`}
                </span>
                <div className="flex items-center gap-2">
                  {hasPurchased(material.id) && (
                    <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                      Purchased
                    </span>
                  )}
                  <button
                    onClick={() => navigate(`/materials/${material.id}`)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    {!hasPurchased(material.id) && material.price > 0 && (
                      <ShoppingCart className="h-4 w-4" />
                    )}
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}