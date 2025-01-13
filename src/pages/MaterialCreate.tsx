import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../lib/store';
import { BookOpen, FileText, Image, AlertCircle, Eye } from 'lucide-react';
import RichTextEditor from '../components/RichTextEditor';
import FileUpload from '../components/FileUpload';
import MaterialPreview from '../components/MaterialPreview';

type MaterialType = 'text' | 'image' | 'lesson_plan';

interface FormData {
  title: string;
  description: string;
  content: string;
  material_type: MaterialType;
  category_id: string;
  price: number;
  attachments: string[];
}

export default function MaterialCreate() {
  const navigate = useNavigate();
  const { user, categories, createMaterial } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    content: '',
    material_type: 'text',
    category_id: '',
    price: 0,
    attachments: []
  });

  if (!user || user.user_type !== 'creator') {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError('');

      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }

      if (!formData.category_id) {
        throw new Error('Category is required');
      }

      if (formData.price < 0) {
        throw new Error('Price cannot be negative');
      }

      const material = await createMaterial(formData);
      navigate(`/materials/${material.id}`);
    } catch (err) {
      console.error('Create material error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create material');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (url: string) => {
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, url]
    }));
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Material</h1>
        <p className="text-gray-600">Share your knowledge with the community</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 text-red-500 p-4 rounded-md flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Material Type
          </label>
          <div className="grid grid-cols-3 gap-4">
            {(['text', 'image', 'lesson_plan'] as MaterialType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, material_type: type }))}
                className={`p-4 rounded-lg border-2 ${
                  formData.material_type === type
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  {type === 'text' && <FileText className="h-6 w-6 text-gray-600" />}
                  {type === 'image' && <Image className="h-6 w-6 text-gray-600" />}
                  {type === 'lesson_plan' && <BookOpen className="h-6 w-6 text-gray-600" />}
                  <span className="capitalize">{type.replace('_', ' ')}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Enter a descriptive title"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full rounded-md border border-gray-300 px-3 py-2 min-h-[100px]"
            placeholder="Describe your material"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            value={formData.category_id}
            onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Price (USD)
          </label>
          <input
            type="number"
            id="price"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          {formData.material_type === 'image' ? (
            <FileUpload
              onUpload={(url) => setFormData(prev => ({ ...prev, content: url }))}
              onError={(error) => setError(error)}
              accept="image/*"
              maxSize={5 * 1024 * 1024}
            />
          ) : (
            <RichTextEditor
              content={formData.content}
              onChange={(content) => setFormData(prev => ({ ...prev, content }))}
            />
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Attachments
            </label>
            <FileUpload
              onUpload={handleFileUpload}
              onError={(error) => setError(error)}
              accept="image/*,.pdf,.doc,.docx"
              maxSize={10 * 1024 * 1024}
            />
          </div>

          {formData.attachments.length > 0 && (
            <div className="space-y-2">
              {formData.attachments.map((url, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded"
                >
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:text-indigo-500 truncate"
                  >
                    {url.split('/').pop()}
                  </a>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-6 border-t">
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="px-4 py-2 text-indigo-600 hover:text-indigo-500 flex items-center gap-2"
          >
            <Eye className="h-5 w-5" />
            Preview
          </button>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/materials')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Material'}
            </button>
          </div>
        </div>
      </form>

      <MaterialPreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        material={formData}
      />
    </div>
  );
}