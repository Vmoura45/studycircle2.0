import React from 'react';
import { BookOpen } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <BookOpen className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to EduShare
        </h1>
        <p className="text-xl text-gray-600">
          Share and discover educational materials from teachers around the world
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">For Teachers</h2>
          <p className="text-gray-600 mb-4">
            Share your teaching materials and earn from your expertise. Create lesson plans,
            educational content, and resources for other educators.
          </p>
          <ul className="space-y-2 text-gray-600">
            <li>✓ Share your teaching materials</li>
            <li>✓ Earn from your content</li>
            <li>✓ Help other educators</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">For Learners</h2>
          <p className="text-gray-600 mb-4">
            Access high-quality educational materials from experienced teachers.
            Find resources for any subject or grade level.
          </p>
          <ul className="space-y-2 text-gray-600">
            <li>✓ Access quality materials</li>
            <li>✓ Learn from experts</li>
            <li>✓ Save time on preparation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}