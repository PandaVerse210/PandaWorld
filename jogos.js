/* =====================================
   PANDAWORLD - PANDAGAMES
   Comunidade de jogos
===================================== */

// CONFIGURAÇÃO DO SUPABASE

const SUPABASE_URL = "https://vdlrtaetrvvrroivmvok.supabase.co";

const SUPABASE_KEY = "sb_publishable_skIJsHnnl-rwmHtK91KL_A_yg_8Bchx";

const pandaSupabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// =====================================
// ESTILOS
// =====================================

const gamesStyle = document.createElement("style");

gamesStyle.textContent = `
.games-header {
  background: #e4efdf;
  padding: 25px;
  border-radius: 18px;
  margin-bottom: 22px;
}

.games-header h2 {
  color: #304c36;
  margin-bottom: 8px;
}

.games-header p {
  color: #536655;
  line-height: 1.6;
}

.games-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin: 18px 0;
}

.games-button {
  background: #527b59;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px 17px;
  font-weight: bold;
  cursor: pointer;
}

.games-button:hover {
  background: #304c36;
}

.games-input {
  width: 100%;
  padding: 13px;
  border: 1px solid #d9dfd5;
  border-radius: 10px;
  margin: 7px 0 13px;
}

.games-form {
  background: white;
  padding: 22px;
  border-radius: 16px;
  margin-bottom: 22px;
  box-shadow: 0 3px 12px #26372b0c;
}

.games-form label {
  font-weight: bold;
  font-size: 14px;
}

.games-grid {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(230px, 1fr));
  gap: 17px;
}

.game-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 3px 12px #26372b0c;
}

.game-cover {
  width: 100%;
  height: 155px;
  object-fit: cover;
  background: #e4efdf;
}

.game-info {
  padding: 17px;
}

.game-info h3 {
  color: #304c36;
  margin-bottom: 8px;
}

.game-info p {
  color: #777;
  font-size: 14px;
  line-height: 1.5;
  overflow-wrap: anywhere;
}

.game-creator {
  color: #527b59;
  font-size: 12px;
  margin: 12px 0;
}

.game-search {
  width: 100%;
  padding: 13px;
  border: 1px solid #d9dfd5;
  border-radius: 10px;
  margin-bottom: 18px;
}

.games-message {
  padding: 13px;
  border-radius: 10px;
  margin: 10px 0;
  font-size: 14px;
}

.games-success {
  background: #e4efdf;
  color: #304c36;
}

.games-error {
  background: #fce9e9;
  color: #a33;
}

.game-play {
  display: block;
  text-align: center;
  background: #527b59;
  color: white;
  text-decoration: none;
  padding: 11px;
  border-radius: 9px;
  margin-top: 13px;
  font-weight: bold;
}

.game-play:hover {
  background: #304c36;
}

@media(max-width:500px) {
  .games-header {
    padding: 20px;
  }

  .games-form {
    padding: 17px;
  }
}
`;

document.head.appendChild(gamesStyle);


// =====================================
// PROTEÇÃO DE TEXTO HTML
// =====================================

function escapeGameText(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]
  );
}


// =====================================
// VALIDAR LINKS
// =====================================

function validGameUrl(value) {
  try {
    const url = new URL(value);

    return url.protocol === "https:";
  } catch {
    return false;
  }
}


// =====================================
// NOME DO CRIADOR
// =====================================

function getGameCreator() {
  if (
    typeof currentUser !== "undefined" &&
    currentUser &&
    currentUser.email
  ) {
    return currentUser.email;
  }

  return "Jogador Panda";
}


// =====================================
// ABRIR ABA DE JOGOS
// =====================================

async function renderGames() {

  const area = document.getElementById("gamesArea");

  if (!area) return;

  area.innerHTML = `
    <section class="games-header">
      <div style="font-size:45px">🐼🎮</div>

      <h2>Bem-vindo ao PandaGames!</h2>

      <p>
        Descubra jogos criados por estudantes,
        compartilhe suas criações e faça parte
        da nossa comunidade!
      </p>

      <div class="games-actions">
        <button class="games-button"
          onclick="showGameForm()">
          📤 Publicar meu jogo
        </button>
      </div>
    </section>

    <div id="gameFormArea"></div>

    <h2 class="page-title">🌎 Jogos da comunidade</h2>

    <input
      id="gameSearch"
      class="game-search"
      placeholder="🔍 Pesquisar jogos..."
    >

    <div id="gamesMessage"></div>

    <div id="gamesList" class="games-grid">
      <div class="empty">
        Carregando jogos...
      </div>
    </div>
  `;

  document.getElementById("gameSearch")
    .addEventListener("input", filterGames);

  await loadGames();
}


// =====================================
// FORMULÁRIO DE PUBLICAÇÃO
// =====================================

function showGameForm() {

  const area = document.getElementById("gameFormArea");

  if (!area) return;

  area.innerHTML = `
    <section class="games-form">

      <h2>🚀 Publicar um jogo</h2>

      <p style="color:#777;margin:10px 0 18px">
        Compartilhe seu jogo com toda a comunidade!
      </p>

      <form id="publishGameForm">

        <label>Nome do jogo</label>

        <input
          class="games-input"
          id="gameTitle"
          maxlength="60"
          placeholder="Ex: Aventura Panda"
          required
        >

        <label>Descrição</label>

        <textarea
          class="games-input"
          id="gameDescription"
          maxlength="500"
          rows="4"
          placeholder="Conte um pouco sobre seu jogo..."
          required
        ></textarea>

        <label>Link do jogo</label>

        <input
          class="games-input"
          id="gameUrl"
          type="url"
          placeholder="https://..."
          required
        >

        <label>Imagem de capa (opcional)</label>

        <input
          class="games-input"
          id="gameImage"
          type="url"
          placeholder="https://..."
        >

        <button
          class="games-button"
          id="publishGameButton"
          type="submit"
          style="width:100%;margin-top:10px"
        >
          🐼 Enviar jogo
        </button>

        <button
          class="games-button"
          type="button"
          onclick="closeGameForm()"
          style="width:100%;margin-top:10px;background:#888"
        >
          Cancelar
        </button>

      </form>

    </section>
  `;

  document.getElementById("publishGameForm")
    .addEventListener("submit", publishGame);
}


function closeGameForm() {
  const area = document.getElementById("gameFormArea");

  if (area) area.innerHTML = "";
}


// =====================================
// PUBLICAR JOGO
// =====================================

async function publishGame(event) {

  event.preventDefault();

  const button = document.getElementById("publishGameButton");

  const title = document.getElementById("gameTitle")
    .value.trim();

  const description = document.getElementById("gameDescription")
    .value.trim();

  const gameUrl = document.getElementById("gameUrl")
    .value.trim();

  const imageUrl = document.getElementById("gameImage")
    .value.trim();

  const creator = getGameCreator();

  const message = document.getElementById("gamesMessage");

  if (!title || !description || !gameUrl) {
    showGamesMessage("Preencha todos os campos obrigatórios.", "error");
    return;
  }

  if (!validGameUrl(gameUrl)) {
    showGamesMessage("O link do jogo precisa começar com https://", "error");
    return;
  }

  if (imageUrl && !validGameUrl(imageUrl)) {
    showGamesMessage("O link da imagem precisa começar com https://", "error");
    return;
  }

  button.disabled = true;
  button.textContent = "Enviando...";

  try {

    const { error } = await pandaSupabase
      .from("games")
      .insert({
        title: title,
        description: description,
        game_url: gameUrl,
        image_url: imageUrl || null,
        creator_name: creator,
        status: "pending"
      });

    if (error) throw error;

    showGamesMessage(
      "🎉 Seu jogo foi enviado! Ele aparecerá depois da aprovação.",
      "success"
    );

    document.getElementById("publishGameForm").reset();

    closeGameForm();

    await loadGames();

  } catch (error) {

    console.error("Erro ao publicar jogo:", error);

    showGamesMessage(
      "Não foi possível enviar seu jogo. Confira a conexão e tente novamente.",
      "error"
    );

  } finally {

    if (button.isConnected) {
      button.disabled = false;
      button.textContent = "🐼 Enviar jogo";
    }
  }
}


// =====================================
// CARREGAR JOGOS
// =====================================

let communityGames = [];

async function loadGames() {

  const list = document.getElementById("gamesList");

  if (!list) return;

  list.innerHTML = `
    <div class="empty">
      Carregando jogos...
    </div>
  `;

  try {

    const { data, error } = await pandaSupabase
      .from("games")
      .select("id,title,description,game_url,image_url,creator_name,created_at")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) throw error;

    communityGames = data || [];

    displayGames(communityGames);

  } catch (error) {

    console.error("Erro ao carregar jogos:", error);

    list.innerHTML = `
      <div class="empty">
        ⚠️ Não foi possível carregar os jogos.
        Tente novamente mais tarde.
      </div>
    `;
  }
}


// =====================================
// MOSTRAR JOGOS
// =====================================

function displayGames(games) {

  const list = document.getElementById("gamesList");

  if (!list) return;

  if (!games.length) {

    list.innerHTML = `
      <div class="empty">
        <div class="emoji">🎮</div>
        <h2>Nenhum jogo encontrado!</h2>
        <p>Seja o primeiro a compartilhar um jogo com a comunidade.</p>
      </div>
    `;

    return;
  }

  list.innerHTML = games.map(game => {

    const title = escapeGameText(game.title);
    const description = escapeGameText(game.description);
    const creator = escapeGameText(game.creator_name);

    const safeGameUrl = validGameUrl(game.game_url)
      ? escapeGameText(game.game_url)
      : "";

    const safeImageUrl = game.image_url && validGameUrl(game.image_url)
      ? escapeGameText(game.image_url)
      : "";

    const cover = safeImageUrl
      ? `<img class="game-cover" src="${safeImageUrl}" alt="Capa de ${title}" loading="lazy" referrerpolicy="no-referrer">`
      : `<div class="game-cover" style="display:grid;place-items:center;font-size:55px">🎮</div>`;

    return `
      <article class="game-card">

        ${cover}

        <div class="game-info">

          <h3>${title}</h3>

          <p>${description}</p>

          <div class="game-creator">
            🐼 Criado por: ${creator}
          </div>

          ${
            safeGameUrl
              ? `<a
                  class="game-play"
                  href="${safeGameUrl}"
                  target="_blank"
                  rel="noopener noreferrer">
                  ▶ Jogar agora
                </a>`
              : ""
          }

        </div>

      </article>
    `;

  }).join("");
}


// =====================================
// PESQUISAR JOGOS
// =====================================

function filterGames() {

  const search = document.getElementById("gameSearch")
    .value.toLowerCase().trim();

  const filtered = communityGames.filter(game => {

    return (
      game.title.toLowerCase().includes(search) ||
      game.description.toLowerCase().includes(search) ||
      game.creator_name.toLowerCase().includes(search)
    );

  });

  displayGames(filtered);
}


// =====================================
// MENSAGENS
// =====================================

function showGamesMessage(message, type) {

  const area = document.getElementById("gamesMessage");

  if (!area) return;

  area.innerHTML = `
    <div class="games-message ${
      type === "success" ? "games-success" : "games-error"
    }">
      ${escapeGameText(message)}
    </div>
  `;
}
