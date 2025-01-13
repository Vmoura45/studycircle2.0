import { createClient } from '@supabase/supabase-js'
import { Database } from './supabase-types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Variáveis de ambiente do Supabase não encontradas. Verifique seu arquivo .env.')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: { 'x-client-info': 'education-sharing-platform' },
    fetch: (...args) => {
      return fetch(...args).catch(err => {
        console.error('Erro na requisição Supabase:', err);
        throw new Error('Falha na conexão com o servidor. Por favor, verifique sua conexão com a internet.');
      });
    }
  }
})

// Função para verificar a conexão
export async function checkConnection() {
  try {
    const { error } = await supabase.from('profiles').select('count').limit(1).single();
    
    // PGRST116 significa que a tabela está vazia, o que é OK
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Erro na verificação de conexão:', error);
    return false;
  }
}