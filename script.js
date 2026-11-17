
let registerMode = false;
let currentUser = null;

const ACCOUNTS_KEY = "pandaverse_accounts_v1";

// ==========================================
// ELEMENTOS
// ==========================================

const authArea = document.getElementById("authArea");
const app = document.getElementById("app");
const authForm = document.getElementById("authForm");
const authButton = document.getElementById("authButton");
const authDescription = document.getElementById("authDescription");
const authMessage = document.getElementById("authMessage");
const switchAuth = document.getElementById("switchAuth");
const passwordInput = document.getElementById("password");

// ==========================================
// VERIFICAR CONEXÃO
// ==========================================

if (!window.pandaSupabase && typeof pandaSupabase === "undefined") {
  throw new Error("Supabase não foi conectado. Confira supabase.js.");
}

// ==========================================
// DADOS LOCAIS DO JOGADOR
// ==========================================

function getAccounts() {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function getLocalPlayer(user) {
  const accounts = getAccounts();
  const email = (user.email || "").toLowerCase();

  const oldData = accounts[email] || {};

  const player = {
    ...oldData,
    id: user.id,
    email: user.email,
    coins: typeof oldData.coins === "number" ? oldData.coins : 100,
    inventory: Array.isArray(oldData.inventory) ? oldData.inventory : [],
    equipped: oldData.equipped || {}
  };

  accounts[email] = player;
  saveAccounts(accounts);

  return player;
}

// ==========================================
// MENSAGENS
// ==========================================

function setAuthMessage(message, success = false) {
  authMessage.textContent = message;
  authMessage.style.color = success ? "#527b59" : "#b33b3b";
}

// ==========================================
// ALTERNAR LOGIN E CADASTRO
// ==========================================

switchAuth.addEventListener("click", () => {
  registerMode = !registerMode;

  authButton.textContent = registerMode
    ? "Criar minha conta"
    : "Entrar";

  authDescription.textContent = registerMode
    ? "Faça seu cadastro no PandaWorld!"
    : "Entre no seu universo de leitura e criatividade!";

  switchAuth.textContent = registerMode
    ? "Já tenho uma conta. Entrar"
    : "Ainda não tem conta? Criar conta";

  passwordInput.autocomplete = registerMode
    ? "new-password"
    : "current-password";

  passwordInput.value = "";
  setAuthMessage("");
});

// ==========================================
// CADASTRO E LOGIN
// ==========================================

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  setAuthMessage("");

  const email = document.getElementById("email")
    .value.trim().toLowerCase();

  const password = passwordInput.value;

  if (password.length < 8) {
    setAuthMessage("A senha precisa ter pelo menos 8 caracteres.");
    return;
  }

  authButton.disabled = true;
  authButton.textContent = "Aguarde...";

  try {
    if (registerMode) {
      const { data, error } = await pandaSupabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin
        }
      });

      if (error) throw error;

      passwordInput.value = "";

      if (data.session && data.user) {
        openApp(data.user);
      } else {
        setAuthMessage(
          "Cadastro realizado! Confira seu e-mail e confirme sua conta antes de entrar.",
          true
        );
      }

    } else {
      const { data, error } =
        await pandaSupabase.auth.signInWithPassword({
          email,
          password
        });

      if (error) throw error;

      passwordInput.value = "";
      openApp(data.user);
    }

  } catch (error) {
    console.error("Erro de autenticação:", error);

    setAuthMessage(
      error.message || "Não foi possível realizar a operação."
    );

  } finally {
    authButton.disabled = false;
    authButton.textContent = registerMode
      ? "Criar minha conta"
      : "Entrar";
  }
});

// ==========================================
// ABRIR APLICATIVO
// ==========================================

function openApp(user) {
  if (!user) return;

  currentUser = getLocalPlayer(user);

  authArea.style.display = "none";
  app.style.display = "block";

  showPage("home");
}

// ==========================================
// SAIR
// ==========================================

document.getElementById("logoutButton")
  .addEventListener("click", async () => {

    const button = document.getElementById("logoutButton");
    button.disabled = true;

    try {
      const { error } = await pandaSupabase.auth.signOut();

      if (error) throw error;

      currentUser = null;
      app.style.display = "none";
      authArea.style.display = "flex";

      passwordInput.value = "";
      setAuthMessage("");

    } catch (error) {
      console.error("Erro ao sair:", error);
      alert("Não foi possível sair da conta. Tente novamente.");

    } finally {
      button.disabled = false;
    }
  });

// ==========================================
// NAVEGAÇÃO
// ==========================================

document.querySelectorAll("[data-page]").forEach(button => {
  button.addEventListener("click", () => {

    document.querySelectorAll("[data-page]")
      .forEach(item => item.classList.remove("active"));

    button.classList.add("active");
    showPage(button.dataset.page);
  });
});

// ==========================================
// PÁGINAS
// ==========================================

function showPage(page) {
  const content = document.getElementById("content");

  const pages = {
    home: `
      <section class="welcome">
        <div class="welcome-emoji">🐼🎋</div>
        <h1>Bem-vindo ao PandaWorld!</h1>
        <p>
          Um lugar onde estudantes podem criar histórias,
          descobrir livros, compartilhar jogos e fazer
          parte de uma comunidade cheia de criatividade.
        </p>
      </section>

      <h2>Explore nosso universo!</h2>

      <section class="cards">
        <article class="card">
          <div class="emoji">📚</div>
          <h3>Biblioteca</h3>
          <p>Leia histórias escritas pelos próprios estudantes.</p>
        </article>

        <article class="card">
          <div class="emoji">✍️</div>
          <h3>Escrita</h3>
          <p>Crie seu próprio livro e compartilhe sua imaginação.</p>
        </article>

        <article class="card">
          <div class="emoji">🛍️</div>
          <h3>Loja Panda</h3>
          <p>Personalize seu avatar com itens especiais.</p>
        </article>

        <article class="card">
          <div class="emoji">🎮</div>
          <h3>Jogos</h3>
          <p>Compartilhe jogos interessantes com a comunidade.</p>
        </article>

        <article class="card">
          <div class="emoji">🏆</div>
          <h3>Ranking</h3>
          <p>Veja as conquistas dos participantes.</p>
        </article>

        <article class="card">
          <div class="emoji">📰</div>
          <h3>Notícias</h3>
          <p>Acompanhe as novidades da escola e da comunidade.</p>
        </article>
      </section>
    `,

    library: `
      <h1 class="page-title">📚 Biblioteca Panda</h1>
      <div class="empty">Carregando biblioteca...</div>
    `,

    create: `
      <h1 class="page-title">✍️ Criar meu livro</h1>
      <div class="empty">Preparando seu editor...</div>
    `,

    shop: `
      <h1 class="page-title">🛍️ Loja Panda</h1>
      <div class="empty">Preparando sua loja...</div>
    `,

    games: `
      <h1 class="page-title">🎮 PandaGames</h1>
      <div id="gamesArea"></div>
    `,

    ranking: `
      <h1 class="page-title">🏆 Ranking</h1>
      <div class="empty">
        <div class="emoji">🏆</div>
        <h2>Ranking em construção</h2>
        <p>As conquistas dos estudantes aparecerão aqui.</p>
      </div>
    `,

    news: `
      <h1 class="page-title">📰 Notícias</h1>
      <div class="empty">
        <div class="emoji">📰</div>
        <h2>Notícias da comunidade</h2>
        <p>As notícias serão publicadas pela administração.</p>
      </div>
    `,

    profile: `
      <h1 class="page-title">👤 Meu perfil</h1>
      <div class="card">
        <div class="emoji">🐼</div>
        <h2 id="profileEmail"></h2>
        <p id="profileCoins"></p>
      </div>
    `
  };

  content.innerHTML = pages[page] || pages.home;

  if (page === "library") {
    if (typeof renderLibrary === "function") {
      renderLibrary();
    } else {
      showLibraryError();
    }
  }

  if (page === "create") {
    if (typeof renderBookEditor === "function") {
      renderBookEditor();
    } else {
      showEditorError();
    }
  }

  if (page === "shop") {
    if (typeof renderShop === "function") {
      renderShop();
    } else {
      content.innerHTML = `
        <h1 class="page-title">🛍️ Loja Panda</h1>
        <div class="empty">Não foi possível carregar loja.js.</div>
      `;
    }
  }

  if (page === "games") {
    if (typeof renderGames === "function") {
      renderGames();
    } else {
      content.innerHTML = `
        <h1 class="page-title">🎮 PandaGames</h1>
        <div class="empty">Não foi possível carregar jogos.js.</div>
      `;
    }
  }

  if (page === "profile" && currentUser) {
    document.getElementById("profileEmail").textContent =
      currentUser.email;

    document.getElementById("profileCoins").textContent =
      "🪙 Moedas: " + currentUser.coins;
  }
}

// ==========================================
// ERROS DOS MÓDULOS
// ==========================================

function showEditorError() {
  document.getElementById("content").innerHTML = `
    <h1 class="page-title">✍️ Criar meu livro</h1>
    <div class="empty">
      <div class="emoji">⚠️</div>
      <h2>Não foi possível carregar o editor.</h2>
      <p>Confira o arquivo biblioteca.js.</p>
    </div>
  `;
}

function showLibraryError() {
  document.getElementById("content").innerHTML = `
    <h1 class="page-title">📚 Biblioteca Panda</h1>
    <div class="empty">
      <div class="emoji">⚠️</div>
      <h2>Não foi possível carregar a biblioteca.</h2>
      <p>Confira biblioteca.js.</p>
    </div>
  `;
}

// ==========================================
// RESTAURAR SESSÃO
// ==========================================

async function restoreSession() {
  try {
    const { data, error } =
      await pandaSupabase.auth.getSession();

    if (error) throw error;

    if (data.session?.user) {
      openApp(data.session.user);
    } else {
      currentUser = null;
      app.style.display = "none";
      authArea.style.display = "flex";
    }

  } catch (error) {
    console.error("Erro ao restaurar sessão:", error);

    setAuthMessage(
      "Não foi possível verificar sua sessão. Atualize a página."
    );
  }
}

// ==========================================
// OBSERVAR AUTENTICAÇÃO
// ==========================================

pandaSupabase.auth.onAuthStateChange((event, session) => {

  if (event === "SIGNED_IN" && session?.user) {
    if (currentUser?.id !== session.user.id) {
      openApp(session.user);
    }
  }

  if (event === "SIGNED_OUT") {
    currentUser = null;
    app.style.display = "none";
    authArea.style.display = "flex";
  }
});

// ==========================================
// INICIAR
// ==========================================

restoreSession();
