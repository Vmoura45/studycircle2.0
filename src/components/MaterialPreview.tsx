import React from 'react';
import { Eye, Download, Share2, X } from 'lucide-react';

interface MaterialPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  material: {
    title: string;
    content: string;
    material_type: string;
    attachments?: string[];
  };
}

export default function MaterialPreview({ isOpen, onClose, material }: MaterialPreviewProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">{material.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          {material.material_type === 'image' ? (
            <img 
              src={material.content} 
              alt={material.title}
              className="max-w-full rounded-lg mx-auto"
            />
          ) : (
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: material.content }}
            />
          )}
          
          {material.attachments && material.attachments.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <h3 className="text-lg font-semibold mb-3">Attachments</h3>
              <div className="space-y-2">
                {material.attachments.map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-500"
                  >
                    <Download className="h-4 w-4" />
                    {url.split('/').pop()}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}