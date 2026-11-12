
// ==========================================
// 🐼 PANDAWORLD - LOJA PANDA PIXEL
// ==========================================

const SHOP_ITEMS = [
  // ROUPAS
  {id:"shirt_green",name:"Camiseta Verde",category:"roupa",price:30,icon:"👕",color:"#65a875"},
  {id:"shirt_blue",name:"Camiseta Azul",category:"roupa",price:30,icon:"👕",color:"#5798d1"},
  {id:"shirt_pink",name:"Camiseta Rosa",category:"roupa",price:40,icon:"👚",color:"#ed91bb"},
  {id:"hoodie",name:"Moletom Panda",category:"roupa",price:70,icon:"🧥",color:"#777777"},

  // CHAPÉUS
  {id:"cap",name:"Boné Estiloso",category:"chapeu",price:35,icon:"🧢",color:"#e3b34d"},
  {id:"crown",name:"Coroa Dourada",category:"chapeu",price:100,icon:"👑",color:"#e6c34c"},
  {id:"hat",name:"Chapéu Mágico",category:"chapeu",price:65,icon:"🎩",color:"#59447d"},

  // ACESSÓRIOS
  {id:"glasses",name:"Óculos Descolados",category:"acessorio",price:45,icon:"🤓",color:"#416e9b"},
  {id:"bow",name:"Laço Fofo",category:"acessorio",price:25,icon:"🎀",color:"#e98bac"},
  {id:"backpack",name:"Mochila Panda",category:"acessorio",price:55,icon:"🎒",color:"#d58a48"},

  // FUNDOS
  {id:"forest",name:"Floresta Verde",category:"fundo",price:50,icon:"🌳",color:"#82b879"},
  {id:"space",name:"Espaço Estelar",category:"fundo",price:80,icon:"🌌",color:"#554b91"}
];

let shopCategory = "todos";

// ==========================================
// ESTILOS DA LOJA
// ==========================================

(function addShopStyles() {

  if (document.getElementById("pandaShopStyles")) return;

  const style = document.createElement("style");

  style.id = "pandaShopStyles";

  style.textContent = `
    .shop-container {
      color: #26372b;
    }

    .shop-hero {
      background: linear-gradient(135deg,#304c36,#527b59);
      color: white;
      padding: 25px;
      border-radius: 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 15px;
    }

    .shop-coins {
      background: #ffffff25;
      border: 1px solid #ffffff55;
      padding: 12px 18px;
      border-radius: 12px;
      font-weight: bold;
      font-size: 19px;
    }

    .shop-layout {
      display: grid;
      grid-template-columns: minmax(220px,300px) 1fr;
      gap: 20px;
      margin-top: 22px;
      align-items: start;
    }

    .shop-panel {
      background: white;
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 3px 12px #26372b0c;
    }

    .panda-preview {
      background: #e4efdf;
      border-radius: 15px;
      padding: 20px;
      text-align: center;
      min-height: 280px;
    }

    .pixel-stage {
      background: #c7dfbd;
      border: 4px solid #527b59;
      border-radius: 10px;
      padding: 20px 8px;
      margin: 15px 0;
      image-rendering: pixelated;
    }

    .pixel-panda {
      display: grid;
      grid-template-columns: repeat(11, 12px);
      grid-auto-rows: 12px;
      justify-content: center;
      gap: 0;
      margin: auto;
      width: max-content;
      image-rendering: pixelated;
    }

    .pixel {
      width: 12px;
      height: 12px;
    }

    .pixel-B { background: #26372b; }
    .pixel-W { background: #ffffff; }
    .pixel-K { background: #111111; }
    .pixel-P { background: #f3a4ae; }
    .pixel-G { background: var(--outfit-color,#65a875); }
    .pixel-T { background: #527b59; }

    .shop-equipped {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      justify-content: center;
      margin-top: 12px;
    }

    .equipped-tag {
      background: white;
      border-radius: 8px;
      padding: 6px 9px;
      font-size: 12px;
    }

    .shop-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
      margin-bottom: 18px;
    }

    .shop-tab {
      background: #edf3e9;
      border: none;
      border-radius: 9px;
      padding: 10px 13px;
      color: #304c36;
    }

    .shop-tab.active {
      background: #527b59;
      color: white;
    }

    .shop-products {
      display: grid;
      grid-template-columns: repeat(auto-fit,minmax(145px,1fr));
      gap: 12px;
    }

    .shop-product {
      background: #faf8ef;
      border: 2px solid #edf0e8;
      border-radius: 13px;
      padding: 14px 10px;
      text-align: center;
    }

    .shop-product-icon {
      font-size: 42px;
      margin: 8px 0;
    }

    .shop-product h3 {
      font-size: 14px;
      margin-bottom: 7px;
    }

    .shop-price {
      color: #527b59;
      font-weight: bold;
      margin: 9px 0;
    }

    .shop-action {
      border: none;
      border-radius: 8px;
      background: #527b59;
      color: white;
      padding: 10px;
      width: 100%;
      font-weight: bold;
      font-size: 12px;
    }

    .shop-action:hover {
      background: #304c36;
    }

    .shop-action:disabled {
      background: #aaa;
      cursor: not-allowed;
    }

    .shop-inventory {
      margin-top: 22px;
    }

    .shop-notice {
      padding: 12px;
      border-radius: 9px;
      margin-top: 12px;
      background: #e4efdf;
      color: #304c36;
      display: none;
    }

    @media(max-width:650px) {
      .shop-layout {
        grid-template-columns: 1fr;
      }
    }
  `;

  document.head.appendChild(style);

})();

// ==========================================
// DADOS DO JOGADOR
// ==========================================

function getShopData() {

  if (!currentUser) return null;

  if (!Array.isArray(currentUser.inventory)) {
    currentUser.inventory = [];
  }

  if (!currentUser.equipped) {
    currentUser.equipped = {};
  }

  if (typeof currentUser.coins !== "number") {
    currentUser.coins = 0;
  }

  return currentUser;
}

// ==========================================
// SALVAR DADOS DO JOGADOR
// ==========================================

function saveShopData() {

  if (!currentUser) return;

  const accounts = getAccounts();

  const email = currentUser.email;

  accounts[email] = {
    ...accounts[email],
    ...currentUser
  };

  saveAccounts(accounts);
}

// ==========================================
// DESENHAR PANDA PIXEL
// ==========================================

function renderPixelPanda() {

  const data = getShopData();

  const rows = [
    "....BBB....",
    "...BWWWB...",
    "..BWWWWWB..",
    ".BWWKWWKWB.",
    ".BWWWWWWWB.",
    ".BWWKWWKWB.",
    "..BWWPWWB..",
    "...BWWWB...",
    "..BWWWWWB..",
    "..BGGGGGB..",
    "..BGGGGGB..",
    "...BBBBB..."
  ];

  const shirt = SHOP_ITEMS.find(
    item => item.id === data?.equipped?.roupa
  );

  const outfitColor = shirt?.color || "#65a875";

  const panda = rows.map(row => {

    return [...row].map(char => {

      if (char === ".") {
        return `<span class="pixel"></span>`;
      }

      if (char === "G") {
        return `<span class="pixel pixel-G"
          style="background:${outfitColor}"></span>`;
      }

      return `<span class="pixel pixel-${char}"></span>`;

    }).join("");

  }).join("");

  return `
    <div class="pixel-stage">
      <div class="pixel-panda"
        style="--outfit-color:${outfitColor}">
        ${panda}
      </div>
    </div>
  `;
}

// ==========================================
// MOSTRAR LOJA
// ==========================================

function renderShop() {

  const content = document.getElementById("content");

  const data = getShopData();

  if (!data) return;

  content.innerHTML = `

    <section class="shop-container">

      <div class="shop-hero">

        <div>
          <h1>🛍️ Loja Panda</h1>
          <p style="margin-top:8px">
            Vista seu panda e mostre seu estilo!
          </p>
        </div>

        <div class="shop-coins" id="shopCoins">
          🪙 ${data.coins} moedas
        </div>

      </div>

      <div class="shop-layout">

        <section class="shop-panel">

          <h2>🐼 Seu panda</h2>

          <div class="panda-preview">

            ${renderPixelPanda()}

            <h3>Meu Panda</h3>

            <p style="font-size:12px;color:#777">
              Seu personagem personalizado
            </p>

            <div class="shop-equipped"
              id="equippedItems"></div>

          </div>

          <h3 style="margin-top:20px">
            🎒 Meu inventário
          </h3>

          <div id="inventoryList"></div>

        </section>

        <section class="shop-panel">

          <h2 style="margin-bottom:15px">
            ✨ Produtos especiais
          </h2>

          <div class="shop-tabs">

            <button class="shop-tab active"
              onclick="filterShop('todos',this)">
              🌟 Todos
            </button>

            <button class="shop-tab"
              onclick="filterShop('roupa',this)">
              👕 Roupas
            </button>

            <button class="shop-tab"
              onclick="filterShop('chapeu',this)">
              🎩 Chapéus
            </button>

            <button class="shop-tab"
              onclick="filterShop('acessorio',this)">
              👓 Acessórios
            </button>

            <button class="shop-tab"
              onclick="filterShop('fundo',this)">
              🌈 Fundos
            </button>

          </div>

          <div class="shop-products"
            id="shopProducts"></div>

          <div class="shop-notice"
            id="shopNotice"></div>

        </section>

      </div>

    </section>

  `;

  shopCategory = "todos";

  renderShopProducts();
  renderShopInventory();
  renderEquippedItems();

}

// ==========================================
// FILTRAR PRODUTOS
// ==========================================

function filterShop(category, button) {

  shopCategory = category;

  document.querySelectorAll(".shop-tab")
    .forEach(tab => tab.classList.remove("active"));

  button.classList.add("active");

  renderShopProducts();

}

// ==========================================
// MOSTRAR PRODUTOS
// ==========================================

function renderShopProducts() {

  const data = getShopData();

  const container = document.getElementById("shopProducts");

  if (!data || !container) return;

  const products = SHOP_ITEMS.filter(item => {

    return shopCategory === "todos" ||
      item.category === shopCategory;

  });

  container.innerHTML = products.map(item => {

    const owned = data.inventory.includes(item.id);

    const equipped = data.equipped[item.category] === item.id;

    let action = "";

    if (equipped) {

      action = `
        <button class="shop-action" disabled>
          ✓ Equipado
        </button>
      `;

    } else if (owned) {

      action = `
        <button class="shop-action"
          onclick="equipShopItem('${item.id}')">
          Equipar
        </button>
      `;

    } else {

      action = `
        <button class="shop-action"
          onclick="buyShopItem('${item.id}')"
          ${data.coins < item.price ? "disabled" : ""}>
          🪙 Comprar
        </button>
      `;

    }

    return `

      <article class="shop-product">

        <div class="shop-product-icon">
          ${item.icon}
        </div>

        <h3>${item.name}</h3>

        <p class="shop-price">
          🪙 ${item.price}
        </p>

        ${owned
          ? `<p style="font-size:11px;color:#527b59;margin-bottom:8px">Já adquirido</p>`
          : ""
        }

        ${action}

      </article>

    `;

  }).join("");

}

// ==========================================
// COMPRAR PRODUTO
// ==========================================

function buyShopItem(id) {

  const data = getShopData();

  if (!data) return;

  const item = SHOP_ITEMS.find(
    product => product.id === id
  );

  if (!item) return;

  if (data.inventory.includes(id)) {
    showShopNotice("Você já possui esse item!");
    return;
  }

  if (data.coins < item.price) {
    showShopNotice("Você não tem moedas suficientes!");
    return;
  }

  const confirmed = confirm(
    `Deseja comprar ${item.name} por ${item.price} moedas?`
  );

  if (!confirmed) return;

  data.coins -= item.price;

  data.inventory.push(id);

  saveShopData();

  showShopNotice("🎉 Compra realizada com sucesso!");

  renderShop();

}

// ==========================================
// EQUIPAR PRODUTO
// ==========================================

function equipShopItem(id) {

  const data = getShopData();

  if (!data || !data.inventory.includes(id)) return;

  const item = SHOP_ITEMS.find(
    product => product.id === id
  );

  if (!item) return;

  data.equipped[item.category] = id;

  saveShopData();

  showShopNotice("✨ Item equipado!");

  renderShop();

}

// ==========================================
// RETIRAR PRODUTO
// ==========================================

function unequipShopItem(category) {

  const data = getShopData();

  if (!data) return;

  delete data.equipped[category];

  saveShopData();

  renderShop();

}

// ==========================================
// INVENTÁRIO
// ==========================================

function renderShopInventory() {

  const data = getShopData();

  const container = document.getElementById("inventoryList");

  if (!data || !container) return;

  const ownedItems = SHOP_ITEMS.filter(
    item => data.inventory.includes(item.id)
  );

  if (ownedItems.length === 0) {

    container.innerHTML = `
      <p style="font-size:13px;color:#888;margin-top:10px">
        Você ainda não possui itens. Visite a loja!
      </p>
    `;

    return;
  }

  container.innerHTML = ownedItems.map(item => {

    const equipped = data.equipped[item.category] === item.id;

    return `
      <div style="
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:8px;
        background:#f3f6ef;
        padding:9px;
        border-radius:9px;
        margin-top:8px;
      ">

        <span style="font-size:13px">
          ${item.icon} ${item.name}
        </span>

        ${equipped
          ? `<span style="color:#527b59;font-size:11px">Equipado ✓</span>`
          : `<button
              class="shop-action"
              style="width:auto;padding:7px"
              onclick="equipShopItem('${item.id}')">
              Usar
            </button>`
        }

      </div>
    `;

  }).join("");

}

// ==========================================
// ITENS EQUIPADOS
// ==========================================

function renderEquippedItems() {

  const data = getShopData();

  const container = document.getElementById("equippedItems");

  if (!data || !container) return;

  const equippedItems = Object.entries(data.equipped);

  if (equippedItems.length === 0) {

    container.innerHTML = `
      <span class="equipped-tag">
        Panda sem acessórios
      </span>
    `;

    return;
  }

  container.innerHTML = equippedItems.map(([category,id]) => {

    const item = SHOP_ITEMS.find(
      product => product.id === id
    );

    if (!item) return "";

    return `
      <button
        class="equipped-tag"
        onclick="unequipShopItem('${category}')"
        title="Clique para retirar">
        ${item.icon} ${item.name} ✕
      </button>
    `;

  }).join("");

}

// ==========================================
// MENSAGENS
// ==========================================

function showShopNotice(message) {

  const notice = document.getElementById("shopNotice");

  if (!notice) return;

  notice.textContent = message;

  notice.style.display = "block";

}
