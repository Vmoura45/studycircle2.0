import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../lib/store';
import { BookOpen, AlertCircle, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

export default function Auth() {
  const navigate = useNavigate();
  const { signIn, signUp, error: storeError, setError, user } = useAuthStore();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<'creator' | 'consumer'>('consumer');
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (storeError) {
      setLocalError(storeError);
      setError(null);
    }
  }, [storeError, setError]);

  const validateForm = () => {
    if (!email.trim()) {
      setLocalError('Email é obrigatório');
      return false;
    }
    if (!email.includes('@')) {
      setLocalError('Por favor, insira um email válido');
      return false;
    }
    if (!password) {
      setLocalError('Senha é obrigatória');
      return false;
    }
    if (password.length < 6) {
      setLocalError('A senha deve ter pelo menos 6 caracteres');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setLocalError('');
    setError(null);
    setRegistrationSuccess(false);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (isSignUp) {
        await signUp(email, password, userType);
        setRegistrationSuccess(true);
        setLocalError('Conta criada com sucesso! Você já pode fazer login.');
        // Limpa os campos e muda para a tela de login
        setEmail('');
        setPassword('');
        setIsSignUp(false);
      } else {
        await signIn(email, password);
        // O redirecionamento será feito pelo useEffect quando o user for definido
      }
    } catch (err: any) {
      console.error('Erro na autenticação:', err);
      if (err?.message?.includes('User already registered')) {
        setLocalError('Este email já está registrado. Por favor, faça login.');
        setIsSignUp(false);
      } else {
        setLocalError(err?.message || 'Falha na autenticação. Por favor, tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setLocalError('');
    setRegistrationSuccess(false);
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <BookOpen className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isSignUp ? 'Criar nova conta' : 'Entrar na sua conta'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isSignUp ? 'Comece a compartilhar conhecimento' : 'Acesse materiais educacionais'}
          </p>
        </div>

        {(localError || registrationSuccess) && (
          <div className={`p-4 rounded-md flex items-center gap-2 ${
            registrationSuccess ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            <AlertCircle className="h-5 w-5" />
            {localError}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Seu email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="userType" className="sr-only">Tipo de Conta</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="userType"
                    value={userType}
                    onChange={(e) => setUserType(e.target.value as 'creator' | 'consumer')}
                    className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  >
                    <option value="consumer">Estudante/Aluno</option>
                    <option value="creator">Professor/Criador</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                isSignUp ? 'Criar Conta' : 'Entrar'
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={resetForm}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              {isSignUp
                ? 'Já tem uma conta? Entre aqui'
                : "Não tem uma conta? Cadastre-se"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}