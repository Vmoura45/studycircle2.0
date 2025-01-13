import React from 'react';
import { Star, User, Paperclip } from 'lucide-react';
import type { Database } from '../lib/supabase-types';

type Review = Database['public']['Tables']['reviews']['Row'] & {
  profiles: {
    full_name: string | null;
    email: string;
  };
};

interface ReviewListProps {
  reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-gray-200 pb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="bg-gray-100 rounded-full p-2">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              <span className="font-medium text-gray-900">
                {review.profiles.full_name || review.profiles.email}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {formatDate(review.created_at)}
            </span>
          </div>

          <div className="flex items-center mb-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={`h-5 w-5 ${
                  index < review.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>

          {review.comment && (
            <p className="text-gray-600 mb-3">{review.comment}</p>
          )}

          {review.attachments && review.attachments.length > 0 && (
            <div className="space-y-2">
              {review.attachments.map((url, index) => (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-500"
                >
                  <Paperclip className="h-4 w-4" />
                  {url.split('/').pop()}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}