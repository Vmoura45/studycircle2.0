// studycircle-frontend/app/signup/page.js
"use client"
import SignupForm from '../../components/Auth/SignupForm';

export default function Signup() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Cadastro</h1>
        <SignupForm />
      </div>
    </div>
  );
}