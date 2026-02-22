// ============================================================
// LUVANO AUTH - Módulo central de autenticação
// Incluir em todos os HTMLs antes de qualquer script
// ============================================================

const SUPABASE_URL = 'https://hzpbsvddutdpckfoohuu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_S4z9oNt3unnEc-3d958zQw_1cyZPWH1';

// Páginas que requerem autenticação obrigatória
const PAGINAS_PROTEGIDAS = [
  'perfil.html', 'editar-perfil.html',
  'compras.html', 'favoritos.html',
  'conversas.html', 'chat.html',
  'publicar.html', 'meus-produtos.html',
  'vendedor.html', 'carteira.html',
  'levantamento.html', 'notificacoes.html',
  'pagamento.html',
  'admin.html', 'admin-usuarios.html',
  'admin-produtos.html', 'admin-pagamentos.html',
];

// Páginas onde produto.html requer login
const PRODUTO_REQUER_LOGIN = true;

window.LuvanoAuth = (function () {
  const { createClient } = supabase;
  const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  let _session = null;
  let _user = null;

  async function init() {
    const { data } = await sb.auth.getSession();
    _session = data.session;
    _user = _session?.user || null;

    // Proteger páginas que requerem login
    const pagina = window.location.pathname.split('/').pop() || 'index.html';
    if (PAGINAS_PROTEGIDAS.includes(pagina) && !_user) {
      window.location.href = `login.html?next=${encodeURIComponent(pagina + window.location.search)}`;
      return false;
    }

    // produto.html requer login
    if (pagina === 'produto.html' && PRODUTO_REQUER_LOGIN && !_user) {
      window.location.href = `login.html?next=${encodeURIComponent(pagina + window.location.search)}`;
      return false;
    }

    // Redirecionar usuário já logado das páginas de auth
    if ((pagina === 'login.html' || pagina === 'cadastro.html') && _user) {
      const params = new URLSearchParams(window.location.search);
      window.location.href = params.get('next') || 'index.html';
      return false;
    }

    return true;
  }

  function getUser() { return _user; }
  function getSession() { return _session; }
  function isLogado() { return !!_user; }
  function getSb() { return sb; }

  async function logout() {
    await sb.auth.signOut();
    window.location.href = 'login.html';
  }

  return { init, getUser, getSession, isLogado, getSb, logout };
})();
