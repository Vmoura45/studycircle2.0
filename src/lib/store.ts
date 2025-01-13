import { create } from 'zustand';
import { supabase } from './supabase';
import type { Database } from './supabase-types';

// ... (tipos permanecem os mesmos)

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  error: null,
  materials: [],
  categories: [],
  transactions: [],
  notifications: [],

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });

      // Primeiro tenta fazer login
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          throw new Error('Email ou senha inválidos. Por favor, tente novamente.');
        }
        throw signInError;
      }

      if (!authData.user) {
        throw new Error('Falha no login. Por favor, tente novamente.');
      }

      // Depois busca o perfil
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        throw new Error('Falha ao carregar perfil do usuário. Por favor, tente novamente.');
      }

      set({ user: profile, loading: false, error: null });
    } catch (error) {
      console.error('Sign in error:', error);
      set({ 
        user: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Falha na autenticação'
      });
      throw error;
    }
  },

  signUp: async (email: string, password: string, userType: 'creator' | 'consumer') => {
    try {
      set({ loading: true, error: null });

      // Primeiro tenta criar o usuário
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { user_type: userType }
        }
      });

      if (signUpError) {
        throw signUpError;
      }

      if (!authData.user) {
        throw new Error('Falha no registro. Por favor, tente novamente.');
      }

      // Depois cria o perfil
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: authData.user.email!,
          user_type: userType
        })
        .select()
        .single();

      if (profileError) {
        // Se falhar ao criar o perfil, tenta limpar o usuário criado
        await supabase.auth.signOut();
        throw new Error('Falha ao criar perfil do usuário. Por favor, tente novamente.');
      }

      set({ user: profile, loading: false, error: null });
    } catch (error) {
      console.error('Sign up error:', error);
      set({ 
        user: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Falha no registro'
      });
      throw error;
    }
  },

  // ... (resto do código permanece o mesmo)
}));