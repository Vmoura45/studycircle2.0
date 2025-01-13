import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../lib/store';
import NotificationCenter from './NotificationCenter';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-800">EduShare</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/materials" className="text-gray-600 hover:text-indigo-600">
              Materials
            </Link>
            {user ? (
              <>
                <NotificationCenter />
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600"
                >
                  <User className="h-6 w-6" />
                  <span>{user.full_name || user.email}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <LogOut className="h-6 w-6 text-gray-600" />
                </button>
              </>
            ) : (
              <Link 
                to="/auth"
                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}