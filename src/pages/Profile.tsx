import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../lib/store';
import { FileText, Image, BookOpen, TrendingUp, DollarSign, Star, Users, BarChart2 } from 'lucide-react';

interface Analytics {
  totalEarnings: number;
  totalSales: number;
  averageRating: number;
  totalMaterials: number;
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, transactions, materials, fetchUserTransactions } = useAuthStore();
  const [analytics, setAnalytics] = useState<Analytics>({
    totalEarnings: 0,
    totalSales: 0,
    averageRating: 0,
    totalMaterials: 0
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchUserTransactions();
  }, [user, navigate, fetchUserTransactions]);

  useEffect(() => {
    if (user?.user_type === 'creator') {
      const creatorMaterials = materials.filter(m => m.creator_id === user.id);
      const creatorTransactions = transactions.filter(t => 
        creatorMaterials.some(m => m.id === t.material_id)
      );

      setAnalytics({
        totalEarnings: creatorTransactions.reduce((sum, t) => sum + t.creator_earnings, 0),
        totalSales: creatorTransactions.length,
        averageRating: creatorMaterials.reduce((sum, m) => sum + (m.avg_rating || 0), 0) / 
          creatorMaterials.filter(m => m.avg_rating).length || 0,
        totalMaterials: creatorMaterials.length
      });
    }
  }, [user, materials, transactions]);

  if (!user) return null;

  const MaterialTypeIcon = ({ type }: { type: 'image' | 'text' | 'lesson_plan' }) => {
    switch (type) {
      case 'image':
        return <Image className="h-5 w-5" />;
      case 'text':
        return <FileText className="h-5 w-5" />;
      case 'lesson_plan':
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <p className="mt-1 text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Account Type</label>
                <p className="mt-1 capitalize text-gray-900">{user.user_type}</p>
              </div>
            </div>
          </div>

          {user.user_type === 'creator' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Creator Dashboard</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-indigo-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <DollarSign className="h-8 w-8 text-indigo-600" />
                    <span className="text-sm font-medium text-indigo-600">Earnings</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(analytics.totalEarnings)}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Total earnings</p>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                    <span className="text-sm font-medium text-green-600">Sales</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.totalSales}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Total sales</p>
                </div>

                <div className="bg-yellow-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Star className="h-8 w-8 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-600">Rating</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.averageRating.toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Average rating</p>
                </div>

                <div className="bg-purple-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <BookOpen className="h-8 w-8 text-purple-600" />
                    <span className="text-sm font-medium text-purple-600">Materials</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.totalMaterials}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Published materials</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Sales</h3>
                  <BarChart2 className="h-5 w-5 text-gray-400" />
                </div>

                <div className="space-y-4">
                  {transactions
                    .filter(t => t.materials?.creator_id === user.id)
                    .slice(0, 5)
                    .map(transaction => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          {transaction.materials && (
                            <MaterialTypeIcon type={transaction.materials.material_type} />
                          )}
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {transaction.materials?.title}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {formatDate(transaction.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {formatCurrency(transaction.creator_earnings)}
                          </p>
                          <p className="text-sm text-gray-500">
                            Earnings
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Purchase History */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Purchase History</h2>
        
        {transactions.length === 0 ? (
          <p className="text-gray-600">No purchases yet.</p>
        ) : (
          <div className="space-y-4">
            {transactions
              .filter(t => t.user_id === user.id)
              .map((transaction) => (
                <div
                  key={transaction.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {transaction.materials && (
                        <MaterialTypeIcon type={transaction.materials.material_type} />
                      )}
                      <h3 className="font-medium text-gray-900">
                        {transaction.materials?.title}
                      </h3>
                    </div>
                    <span className="text-lg font-semibold text-indigo-600">
                      {formatCurrency(transaction.amount)}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    <p>{transaction.materials?.description}</p>
                    <p className="mt-1">Purchased on {formatDate(transaction.created_at)}</p>
                  </div>
                  
                  <button
                    onClick={() => navigate(`/materials/${transaction.material_id}`)}
                    className="mt-3 text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    View Material
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}