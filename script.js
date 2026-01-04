/* =====================
   CARRINHO
===================== */
let carrinho = [];

/* =====================
   CONTROLE DE QUANTIDADE POR PRODUTO
===================== */
const quantidades = {};

function alterarQtd(produto, valor) {
  if (!quantidades[produto]) {
    quantidades[produto] = 0;
  }

  quantidades[produto] += valor;

  if (quantidades[produto] < 0) {
    quantidades[produto] = 0;
  }

  const span = document.getElementById(`qtd-${produto}`);
  if (span) {
    span.textContent = quantidades[produto];
  }
}

/* =====================
   ADICIONAR AO CARRINHO
===================== */
function addToCart(nome, preco, produtoId) {
  const qtd = quantidades[produtoId] || 0;

  if (qtd === 0) {
    alert("Selecione a quantidade antes de adicionar.");
    return;
  }

  const itemExistente = carrinho.find(item => item.nome === nome);

  if (itemExistente) {
    itemExistente.quantidade += qtd;
  } else {
    carrinho.push({
      nome,
      preco,
      quantidade: qtd
    });
  }

  quantidades[produtoId] = 0;
  const span = document.getElementById(`qtd-${produtoId}`);
  if (span) span.textContent = 0;

  atualizarCarrinho();
}

/* =====================
   ATUALIZAR NÚMERO NA BARRA
===================== */
function atualizarBarraCarrinho() {
  const numero = document.querySelector(".carrinho-numero");
  if (numero) {
    numero.textContent = carrinho.reduce(
      (soma, item) => soma + item.quantidade,
      0
    );
  }
}

/* =====================
   ABRIR / FECHAR POPUP DO CARRINHO
===================== */
function abrirCarrinho() {
  const popup = document.getElementById("carrinhoPopup");
  if (!popup) return;

  popup.style.display = popup.style.display === "block" ? "none" : "block";
  popup.innerHTML = gerarHTMLCarrinho();
}

/* =====================
   HTML DO CARRINHO
===================== */
function gerarHTMLCarrinho() {
  if (carrinho.length === 0) {
    return `
      <div class="carrinho">
        <h2>🛒 Carrinho</h2>
        <p>Nenhum item adicionado.</p>
      </div>
    `;
  }

  return `
    <div class="carrinho">
      <h2>🛒 Carrinho</h2>

      ${carrinho.map((item, i) => `
        <div class="carrinho-item">
          <span>${item.nome} (${item.quantidade}x)</span>
          <div>
            <button onclick="alterarQuantidade(${i}, -1)">➖</button>
            <button onclick="alterarQuantidade(${i}, 1)">➕</button>
            <button onclick="removerItem(${i})">❌</button>
          </div>
        </div>
      `).join("")}

      <p class="total">Total: R$ ${calcularTotal().toFixed(2)}</p>

      <div class="botoes-carrinho">
        <button class="finalizar" onclick="finalizarPedido()">Finalizar Pedido</button>
        <button class="cancelar" onclick="cancelarPedido()">Cancelar</button>
      </div>
    </div>
  `;
}

/* =====================
   ATUALIZAR CARRINHO
===================== */
function atualizarCarrinho() {
  atualizarBarraCarrinho();

  const popup = document.getElementById("carrinhoPopup");
  if (popup && popup.style.display === "block") {
    popup.innerHTML = gerarHTMLCarrinho();
  }
}

/* =====================
   CANCELAR PEDIDO
===================== */
function cancelarPedido() {
  if (confirm("Tem certeza que deseja cancelar o pedido?")) {
    carrinho = [];
    atualizarCarrinho();
  }
}

/* =====================
   ALTERAR QUANTIDADE NO CARRINHO
===================== */
function alterarQuantidade(index, valor) {
  carrinho[index].quantidade += valor;

  if (carrinho[index].quantidade <= 0) {
    carrinho.splice(index, 1);
  }

  atualizarCarrinho();
}

/* =====================
   REMOVER ITEM
===================== */
function removerItem(index) {
  carrinho.splice(index, 1);
  atualizarCarrinho();
}

/* =====================
   CALCULAR TOTAL
===================== */
function calcularTotal() {
  return carrinho.reduce(
    (soma, item) => soma + item.preco * item.quantidade,
    0
  );
}

/* =====================
   FINALIZAR PEDIDO
===================== */
function finalizarPedido() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  window.location.href = "checkout.html";
}

/* =====================
   BOTÃO VOLTAR AO TOPO
===================== */
document.addEventListener("DOMContentLoaded", () => {
  const btnTopo = document.getElementById("btnTopo");

  if (!btnTopo) return;

  window.onscroll = () => {
    btnTopo.style.display = window.scrollY > 100 ? "block" : "none";
  };

  btnTopo.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
});
