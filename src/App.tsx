import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Materials from './pages/Materials';
import MaterialDetail from './pages/MaterialDetail';
import MaterialCreate from './pages/MaterialCreate';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import ConnectionStatus from './components/ConnectionStatus';
import { useAuthStore } from './lib/store';
import { supabase } from './lib/supabase';
import { testConnection } from './lib/test-connection';

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Carregando...</p>
      </div>
    </div>
  );
}

interface PrivateRouteProps {
  children: React.ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, loading } = useAuthStore();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const { setUser, setLoading, setError } = useAuthStore();
  const [connectionError, setConnectionError] = useState<{ error: string; details?: string } | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const initializeApp = async () => {
    try {
      setLoading(true);
      
      // Teste de conexão
      const { success, error, details } = await testConnection();
      if (!success) {
        setConnectionError({ error, details });
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Erro ao buscar perfil:', profileError);
          setUser(null);
        } else {
          setUser(profile);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Erro na inicialização:', error);
      setUser(null);
      setError(error instanceof Error ? error.message : 'Falha na inicialização');
    } finally {
      setLoading(false);
    }
  };

  const handleRetryConnection = async () => {
    setIsRetrying(true);
    await initializeApp();
    setIsRetrying(false);
  };

  useEffect(() => {
    initializeApp();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Erro na mudança de estado de autenticação:', error);
          setUser(null);
        } else {
          setUser(profile);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setLoading, setError]);

  return (
    <>
      <ConnectionStatus
        error={connectionError?.error || null}
        details={connectionError?.details}
        onRetry={handleRetryConnection}
        isRetrying={isRetrying}
      />
      
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/materials" element={<Materials />} />
              <Route 
                path="/materials/new" 
                element={
                  <PrivateRoute>
                    <MaterialCreate />
                  </PrivateRoute>
                } 
              />
              <Route path="/materials/:id" element={<MaterialDetail />} />
              <Route 
                path="/profile" 
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } 
              />
              <Route path="/auth" element={<Auth />} />
            </Routes>
          </main>
        </div>
      </Router>
    </>
  );
}