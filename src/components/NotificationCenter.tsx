import React, { useState, useEffect } from 'react';
import { Bell, X, ShoppingCart, Star, BookOpen, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../lib/store';

type NotificationIcon = {
  [key: string]: React.ReactNode;
};

const NOTIFICATION_ICONS: NotificationIcon = {
  purchase: <ShoppingCart className="h-5 w-5 text-green-500" />,
  review: <Star className="h-5 w-5 text-yellow-500" />,
  material_update: <BookOpen className="h-5 w-5 text-blue-500" />,
  moderation: <AlertCircle className="h-5 w-5 text-red-500" />
};

export default function NotificationCenter() {
  const { user, notifications, fetchNotifications, markNotificationAsRead } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, fetchNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return diffInHours === 0 
        ? 'Just now'
        : `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    }
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const handleNotificationClick = async (notificationId: string) => {
    await markNotificationAsRead(notificationId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Bell className="h-6 w-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-sm text-gray-500">
                    {unreadCount} unread
                  </span>
                )}
              </div>
            </div>
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id)}
                    className={`w-full text-left p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-start gap-3 ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {NOTIFICATION_ICONS[notification.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <span className="text-xs text-gray-400">
                        {formatDate(notification.created_at)}
                      </span>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}