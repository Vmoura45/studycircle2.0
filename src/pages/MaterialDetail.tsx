import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../lib/store';
import { ArrowLeft, BookOpen, FileText, Image, Clock, User, Tag, Star, Edit, Paperclip, X, ShoppingCart } from 'lucide-react';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import RichTextEditor from '../components/RichTextEditor';
import FileUpload from '../components/FileUpload';

export default function MaterialDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    materials, 
    user, 
    reviews, 
    transactions,
    fetchMaterials,
    fetchReviews, 
    createReview, 
    updateMaterial,
    purchaseMaterial,
    fetchUserTransactions 
  } = useAuthStore();

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAttachmentUpload, setShowAttachmentUpload] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    content: '',
    category_id: '',
    price: 0,
    attachments: [] as string[]
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCreatorName = () => {
    if (!material?.creator) return '';
    return material.creator.full_name || material.creator.email;
  };

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError('');
        await Promise.all([
          fetchMaterials(),
          fetchReviews(id),
          user ? fetchUserTransactions() : Promise.resolve()
        ]);
      } catch (err) {
        console.error('Error loading material details:', err);
        setError('Failed to load material details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, user, fetchMaterials, fetchReviews, fetchUserTransactions]);
  
  const material = materials.find(m => m.id === id);
  const materialReviews = id ? reviews[id] || [] : [];
  const isCreator = user?.id === material?.creator_id;
  const hasPurchased = transactions?.some(t => t.material_id === id);

  useEffect(() => {
    if (material) {
      setEditForm({
        title: material.title,
        description: material.description || '',
        content: material.content || '',
        category_id: material.category_id,
        price: material.price,
        attachments: material.attachments || []
      });
    }
  }, [material]);

  const handleReviewSubmit = async (rating: number, comment: string, attachments: string[]) => {
    try {
      await createReview({
        material_id: material!.id,
        rating,
        comment: comment || null,
        attachments
      });
      setShowReviewForm(false);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMaterial(material!.id, editForm);
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update material');
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      setIsProcessing(true);
      setError('');
      await purchaseMaterial(material!.id);
      navigate('/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process purchase');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (url: string) => {
    setEditForm({
      ...editForm,
      attachments: [...editForm.attachments, url]
    });
    setShowAttachmentUpload(false);
  };

  const removeAttachment = (index: number) => {
    setEditForm({
      ...editForm,
      attachments: editForm.attachments.filter((_, i) => i !== index)
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading material details...</p>
        </div>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Material not found</h2>
          <button
            onClick={() => navigate('/materials')}
            className="text-indigo-600 hover:text-indigo-500 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Materials
          </button>
        </div>
      </div>
    );
  }

  const MaterialTypeIcon = () => {
    switch (material.material_type) {
      case 'image':
        return <Image className="h-6 w-6" />;
      case 'text':
        return <FileText className="h-6 w-6" />;
      case 'lesson_plan':
        return <BookOpen className="h-6 w-6" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <button
        onClick={() => navigate('/materials')}
        className="text-indigo-600 hover:text-indigo-500 flex items-center gap-2 mb-8"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Materials
      </button>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <MaterialTypeIcon />
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="text-2xl font-bold text-gray-900 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                />
              ) : (
                <h1 className="text-2xl font-bold text-gray-900">{material.title}</h1>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isCreator && !isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 px-3 py-1 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
              )}
              {isEditing ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditSubmit}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-2xl font-bold text-indigo-600">
                    ${material.price}
                  </span>
                  {!isCreator && (
                    hasPurchased ? (
                      <span className="px-4 py-2 bg-green-600 text-white rounded-md">
                        Purchased
                      </span>
                    ) : (
                      <button
                        onClick={handlePurchase}
                        disabled={isProcessing}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <ShoppingCart className="h-5 w-5" />
                        {isProcessing ? 'Processing...' : 'Purchase'}
                      </button>
                    )
                  )}
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-5 w-5" />
                <span>Created on {formatDate(material.created_at)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <User className="h-5 w-5" />
                <span>By {getCreatorName()}</span>
              </div>
              {material.categories && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Tag className="h-5 w-5" />
                  <span>{material.categories.name}</span>
                </div>
              )}
              {material.avg_rating && (
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`h-5 w-5 ${
                          index < Math.round(material.avg_rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">
                    ({material.total_reviews} reviews)
                  </span>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              {isEditing ? (
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  rows={3}
                />
              ) : (
                <p className="text-gray-600">{material.description}</p>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Content</h3>
            {isEditing ? (
              material.material_type === 'image' ? (
                <div className="text-gray-600">
                  Image content cannot be edited directly. Please create a new material for a different image.
                </div>
              ) : (
                <RichTextEditor
                  content={editForm.content}
                  onChange={(content) => setEditForm({ ...editForm, content })}
                />
              )
            ) : (
              material.material_type === 'image' ? (
                <img 
                  src={material.content} 
                  alt={material.title}
                  className="max-w-full rounded-lg"
                />
              ) : (
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: material.content }}
                />
              )
            )}
          </div>

          <div className="border-t border-gray-200 pt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Attachments</h3>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setShowAttachmentUpload(true)}
                  className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center gap-1"
                >
                  <Paperclip className="h-4 w-4" />
                  Add Attachment
                </button>
              )}
            </div>

            {showAttachmentUpload && isEditing && (
              <div className="mb-4">
                <FileUpload
                  onUpload={handleFileUpload}
                  onError={() => {}}
                  accept="image/*,.pdf,.doc,.docx"
                  maxSize={10 * 1024 * 1024}
                />
              </div>
            )}

            {editForm.attachments && editForm.attachments.length > 0 ? (
              <div className="space-y-2">
                {editForm.attachments.map((url, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                  >
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center gap-2"
                    >
                      <Paperclip className="h-4 w-4" />
                      {url.split('/').pop()}
                    </a>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No attachments available</p>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 bg-gray-50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Reviews ({materialReviews.length})
            </h3>
            {user && user.id !== material.creator_id && !showReviewForm && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Write a Review
              </button>
            )}
          </div>

          {showReviewForm && (
            <div className="mb-8">
              <ReviewForm onSubmit={handleReviewSubmit} />
            </div>
          )}

          <ReviewList reviews={materialReviews} />
        </div>
      </div>
    </div>
  );
}