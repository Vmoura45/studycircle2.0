import { supabase, checkConnection } from './supabase';

export async function testConnection() {
  try {
    console.log('Iniciando teste de conexão com Supabase...');

    // Verifica configuração
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      console.error('Configuração do Supabase não encontrada');
      return { 
        success: false, 
        error: 'Configuração do Supabase não encontrada. Por favor, conecte ao Supabase primeiro.',
        details: 'Verifique se você conectou o projeto ao Supabase e se as variáveis de ambiente estão corretas.'
      };
    }

    // Teste de conectividade básica
    const isConnected = await checkConnection();
    if (!isConnected) {
      return {
        success: false,
        error: 'Não foi possível conectar ao Supabase.',
        details: 'Verifique sua conexão com a internet e se o projeto Supabase está online.'
      };
    }

    // Teste de autenticação
    console.log('Testando serviço de autenticação...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('Erro no serviço de autenticação:', authError);
      return { 
        success: false, 
        error: 'Serviço de autenticação indisponível.',
        details: 'Verifique se o serviço de autenticação do Supabase está ativo.'
      };
    }

    // Teste de acesso ao banco
    console.log('Testando acesso ao banco de dados...');
    const { error: dbError } = await supabase
      .from('categories')
      .select('count')
      .limit(1)
      .single();

    // PGRST116 significa tabela vazia, que é OK
    if (dbError && dbError.code !== 'PGRST116') {
      console.error('Erro no acesso ao banco:', dbError);
      return {
        success: false,
        error: 'Erro ao acessar o banco de dados.',
        details: 'Verifique se as tabelas foram criadas corretamente e se as políticas de segurança estão configuradas.'
      };
    }

    console.log('Todos os testes completados com sucesso');
    return { 
      success: true,
      details: 'Conexão estabelecida com sucesso'
    };
  } catch (err) {
    console.error('Erro no teste de conexão:', err);
    return { 
      success: false, 
      error: 'Erro de conexão inesperado.',
      details: err instanceof Error 
        ? err.message 
        : 'Verifique sua conexão com a internet e tente novamente.'
    };
  }
}