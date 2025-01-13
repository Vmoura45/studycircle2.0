import React, { useState } from 'react';
import { Star, Paperclip, X } from 'lucide-react';
import FileUpload from './FileUpload';

interface ReviewFormProps {
  onSubmit: (rating: number, comment: string, attachments: string[]) => Promise<void>;
}

export default function ReviewForm({ onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit(rating, comment, attachments);
      setRating(0);
      setComment('');
      setAttachments([]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (url: string) => {
    setAttachments([...attachments, url]);
    setShowUpload(false);
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rating
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 focus:outline-none"
            >
              <Star
                className={`h-6 w-6 ${
                  (hoverRating || rating) >= value
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Comment (optional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 min-h-[100px]"
          placeholder="Share your thoughts about this material..."
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Anexo
          </label>
          <button
            type="button"
            onClick={() => setShowUpload(true)}
            className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center gap-1"
          >
            <Paperclip className="h-4 w-4" />
            Adicionar anexo
          </button>
        </div>

        {showUpload && (
          <div className="mb-4">
            <FileUpload
              onUpload={handleFileUpload}
              onError={() => {}}
              accept="image/*,.pdf,.doc,.docx"
              maxSize={10 * 1024 * 1024}
            />
          </div>
        )}

        {attachments.length > 0 && (
          <div className="space-y-2">
            {attachments.map((url, index) => (
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
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={rating === 0 || isSubmitting}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}