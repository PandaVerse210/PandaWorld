
/* =====================================
   PANDAWORLD - BIBLIOTECA PANDA
   Biblioteca online com Supabase
===================================== */

// =====================================
// VERIFICAR SUPABASE
// =====================================

function getPandaDatabase() {
  if (typeof pandaSupabase === "undefined") {
    throw new Error("Supabase não foi conectado.");
  }

  return pandaSupabase;
}

// =====================================
// PROTEGER TEXTOS
// =====================================

function safeText(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

// =====================================
// IDENTIFICAR AUTOR
// =====================================

function getBookAuthor() {
  return currentUser?.email || "Estudante";
}

// =====================================
// LIVROS CARREGADOS
// =====================================

let communityBooks = [];

// =====================================
// MOSTRAR BIBLIOTECA
// =====================================

async function renderLibrary(notice = "") {

  const content = document.getElementById("content");

  if (!content) return;

  content.innerHTML = `
    <h1 class="page-title">📚 Biblioteca Panda</h1>

    <p style="margin-bottom:20px">
      Histórias escritas e publicadas pelos estudantes.
    </p>

    <button class="main-button"
      style="max-width:220px;margin-bottom:22px"
      onclick="renderBookEditor()">
      ✍️ Criar meu livro
    </button>

    ${notice ? `
      <div style="
        background:#e4efdf;
        color:#304c36;
        padding:15px;
        border-radius:10px;
        margin-bottom:20px">
        ${safeText(notice)}
      </div>
    ` : ""}

    <h2 style="margin-bottom:18px">🌎 Livros da comunidade</h2>

    <div class="cards" id="bookList">
      <div class="empty">Carregando biblioteca...</div>
    </div>
  `;

  await loadCommunityBooks();
}

// =====================================
// CARREGAR LIVROS DO SUPABASE
// =====================================

async function loadCommunityBooks() {

  const list = document.getElementById("bookList");

  if (!list) return;

  try {

    const { data, error } = await getPandaDatabase()
      .from("books")
      .select("id,title,description,genre,author,chapters,created_at")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) throw error;

    communityBooks = data || [];

    displayBooks(communityBooks);

  } catch (error) {

    console.error("Erro ao carregar livros:", error);

    list.innerHTML = `
      <div class="empty" style="grid-column:1/-1">
        <div style="font-size:50px">⚠️</div>
        <h2>Não foi possível carregar a biblioteca.</h2>
        <p>Verifique sua conexão com o Supabase.</p>

        <button class="main-button"
          style="max-width:200px"
          onclick="loadCommunityBooks()">
          Tentar novamente
        </button>
      </div>
    `;
  }
}

// =====================================
// MOSTRAR LIVROS
// =====================================

function displayBooks(books) {

  const list = document.getElementById("bookList");

  if (!list) return;

  if (!books.length) {

    list.innerHTML = `
      <div class="empty" style="grid-column:1/-1">
        <div style="font-size:55px">🐼📖</div>

        <h2>Nossa biblioteca está esperando!</h2>

        <p>
          Ainda não existem livros aprovados.
          Seja o primeiro a compartilhar uma história!
        </p>
      </div>
    `;

    return;
  }

  list.innerHTML = books.map(book => `

    <article class="card">

      <div class="emoji">📘</div>

      <h3>${safeText(book.title)}</h3>

      <p>${safeText(book.description)}</p>

      <p style="margin-top:10px">
        <small>Por: ${safeText(book.author)}</small>
      </p>

      <p style="color:#527b59;margin-top:7px">
        ${safeText(book.genre)}
      </p>

      <button class="main-button"
        onclick="readBook('${safeText(book.id)}')">
        📖 Ler livro
      </button>

    </article>

  `).join("");
}

// =====================================
// EDITOR DE LIVROS
// =====================================

function renderBookEditor() {

  const content = document.getElementById("content");

  content.innerHTML = `

    <h1 class="page-title">✍️ Escreva seu livro</h1>

    <div class="card">

      <form id="bookForm">

        <label>Título do livro</label>

        <input
          id="bookTitle"
          maxlength="80"
          required
          placeholder="Digite o título"
          style="width:100%;padding:13px;margin:10px 0;border:1px solid #ddd;border-radius:9px">

        <label>Descrição</label>

        <textarea
          id="bookDescription"
          maxlength="500"
          required
          placeholder="Conte um pouco sobre seu livro..."
          style="width:100%;height:100px;padding:13px;margin:10px 0;border:1px solid #ddd;border-radius:9px"></textarea>

        <label>Gênero</label>

        <select
          id="bookGenre"
          style="width:100%;padding:13px;margin:10px 0;border:1px solid #ddd;border-radius:9px">

          <option>Fantasia</option>
          <option>Aventura</option>
          <option>Comédia</option>
          <option>Romance</option>
          <option>Mistério</option>
          <option>Ficção científica</option>
          <option>Outro</option>

        </select>

        <label>Primeiro capítulo</label>

        <textarea
          id="bookChapter"
          required
          maxlength="15000"
          placeholder="Escreva aqui sua própria história..."
          style="width:100%;height:250px;padding:13px;margin:10px 0;border:1px solid #ddd;border-radius:9px"></textarea>

        <p style="color:#777;font-size:13px;margin:8px 0">
          Seu livro será enviado para aprovação.
        </p>

        <button
          class="main-button"
          id="publishBookButton"
          type="submit">

          📖 Enviar meu livro

        </button>

        <button
          class="main-button"
          type="button"
          style="background:#888"
          onclick="renderLibrary()">

          Voltar

        </button>

        <p id="bookMessage"
          style="margin-top:12px;color:#b33b3b">
        </p>

      </form>

    </div>
  `;

  document.getElementById("bookForm")
    .addEventListener("submit", publishBook);
}

// =====================================
// PUBLICAR LIVRO
// =====================================

async function publishBook(event) {

  event.preventDefault();

  const button = document.getElementById("publishBookButton");

  const title = document.getElementById("bookTitle")
    .value.trim();

  const description = document.getElementById("bookDescription")
    .value.trim();

  const genre = document.getElementById("bookGenre").value;

  const chapter = document.getElementById("bookChapter")
    .value.trim();

  if (!title || !description || !chapter) {
    document.getElementById("bookMessage").textContent =
      "Preencha todos os campos.";
    return;
  }

  button.disabled = true;
  button.textContent = "Enviando...";

  try {

    const { error } = await getPandaDatabase()
      .from("books")
      .insert({
        title: title,
        description: description,
        genre: genre,
        author: getBookAuthor(),

        chapters: [
          {
            title: "Capítulo 1",
            text: chapter
          }
        ],

        status: "pending"
      });

    if (error) throw error;

    renderLibrary(
      "🎉 Seu livro foi enviado! Ele aparecerá na biblioteca depois da aprovação."
    );

  } catch (error) {

    console.error("Erro ao publicar livro:", error);

    document.getElementById("bookMessage").textContent =
      "Não foi possível publicar. Confira a conexão e tente novamente.";

    button.disabled = false;
    button.textContent = "📖 Enviar meu livro";
  }
}

// =====================================
// LER LIVRO
// =====================================

function readBook(id) {

  const book = communityBooks.find(item => item.id === id);

  if (!book) return;

  const content = document.getElementById("content");

  const chapters = Array.isArray(book.chapters)
    ? book.chapters
    : [];

  content.innerHTML = `

    <button class="main-button"
      style="max-width:210px;margin-bottom:20px"
      onclick="renderLibrary()">

      ← Voltar à biblioteca

    </button>

    <article class="card">

      <div style="font-size:45px">📖</div>

      <h1 class="page-title">
        ${safeText(book.title)}
      </h1>

      <p>${safeText(book.description)}</p>

      <p style="margin-top:10px;color:#777">
        Autor: ${safeText(book.author)}
      </p>

      <p style="margin:10px 0;color:#527b59">
        Gênero: ${safeText(book.genre)}
      </p>

      <hr style="margin:20px 0;border:0;border-top:1px solid #ddd">

      ${chapters.map(chapter => `

        <section style="margin-bottom:25px">

          <h2 style="margin-bottom:15px">
            ${safeText(chapter.title)}
          </h2>

          <p style="white-space:pre-wrap;line-height:1.9">
            ${safeText(chapter.text)}
          </p>

        </section>

      `).join("")}

    </article>
  `;
}
