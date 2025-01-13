import React from 'react';
import { History, ArrowLeft, Clock, User } from 'lucide-react';

interface Version {
  id: string;
  version: number;
  changes: string;
  created_at: string;
  created_by: {
    full_name: string | null;
    email: string;
  };
}

interface VersionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  versions: Version[];
  onRestore: (versionId: string) => Promise<void>;
}

export default function VersionHistory({ isOpen, onClose, versions, onRestore }: VersionHistoryProps) {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-gray-500" />
            <h2 className="text-xl font-semibold">Version History</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            {versions.map((version) => (
              <div
                key={version.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">
                    Version {version.version}
                  </h3>
                  <button
                    onClick={() => onRestore(version.id)}
                    className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center gap-1"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Restore
                  </button>
                </div>

                <p className="text-gray-600 mb-3">{version.changes}</p>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatDate(version.created_at)}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {version.created_by.full_name || version.created_by.email}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}