/* =====================
   CARRINHO
===================== */
let carrinho = [];
let itemModalAtual = null;

/* =====================
   MODAL DE DETALHES
===================== */
function abrirModal(elemento) {

  itemModalAtual = {
    nome: elemento.dataset.nome,
    preco: Number(elemento.dataset.preco),
    descricao: elemento.dataset.descricao,
    imagens: JSON.parse(elemento.dataset.imagens)
  };

  document.getElementById("modalNome").textContent =
    itemModalAtual.nome;

  document.getElementById("modalDescricao").textContent =
    itemModalAtual.descricao;

  document.getElementById("modalPreco").textContent =
    `R$ ${itemModalAtual.preco.toFixed(2)}`;

  const imgPrincipal =
    document.getElementById("modalImagemPrincipal");

  imgPrincipal.src =
    itemModalAtual.imagens[0];

  const miniaturas =
    document.getElementById("modalMiniaturas");

  miniaturas.innerHTML = "";

  itemModalAtual.imagens.forEach(img => {

    const thumb = document.createElement("img");

    thumb.src = img;

    thumb.onclick = () => {
      imgPrincipal.src = img;
    };

    miniaturas.appendChild(thumb);

  });

  document.getElementById("modalDetalhes").style.display = "flex";
}

function fecharModal() {
  document.getElementById("modalDetalhes").style.display = "none";
}

function adicionarDoModal() {

  addToCart(
    itemModalAtual.nome,
    itemModalAtual.preco,
    "modal"
  );

  fecharModal();
}

function abrirModalItem(elemento) {
  abrirModal(elemento);
}

/* =====================
   CONTROLE DE QUANTIDADE
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

  const span =
    document.getElementById(`qtd-${produto}`);

  if (span) {
    span.textContent = quantidades[produto];
  }
}

/* =====================
   ADICIONAR AO CARRINHO
===================== */
function addToCart(nome, preco, produtoId) {

  const qtd = quantidades[produtoId] || 1;

  if (qtd === 0) {

    alert("Selecione a quantidade antes de adicionar.");

    return;
  }

  const existente =
    carrinho.find(item => item.nome === nome);

  if (existente) {

    existente.quantidade += qtd;

  } else {

    carrinho.push({
      nome,
      preco,
      quantidade: qtd
    });

  }

  quantidades[produtoId] = 0;

  const span =
    document.getElementById(`qtd-${produtoId}`);

  if (span) {
    span.textContent = 0;
  }

  atualizarCarrinho();
}

/* =====================
   BARRA DO CARRINHO
===================== */
function atualizarBarraCarrinho() {

  const numero =
    document.querySelector(".carrinho-numero");

  if (!numero) return;

  numero.textContent = carrinho.reduce(
    (soma, item) => soma + item.quantidade,
    0
  );
}

/* =====================
   POPUP DO CARRINHO
===================== */
function abrirCarrinho() {

  const popup =
    document.getElementById("carrinhoPopup");

  if (!popup) return;

  popup.style.display =
    popup.style.display === "flex"
      ? "none"
      : "flex";

  popup.innerHTML = gerarHTMLCarrinho();
}

function gerarHTMLCarrinho() {

  if (carrinho.length === 0) {

    return `
      <div class="carrinho-modern">
        <div class="carrinho-topo">
          <h2>🛒 Meu Carrinho</h2>
        </div>

        <div class="carrinho-vazio">
          <p>Seu carrinho está vazio.</p>
        </div>
      </div>
    `;
  }

  return `

    <div class="carrinho-modern">

      <div class="carrinho-topo">
        <h2>🛒 Meu Carrinho</h2>

        <button
          class="fechar-carrinho"
          onclick="fecharCarrinho()">

          ✕

        </button>
      </div>

      <div class="carrinho-lista">

        ${carrinho.map((item, i) => `

          <div class="carrinho-card">

            <div class="carrinho-info">

              <h3>${item.nome}</h3>

              <span class="carrinho-qtd">
                ${item.quantidade}x item(s)
              </span>

            </div>

            <div class="carrinho-direita">

              <span class="carrinho-preco">
                R$ ${(item.preco * item.quantidade).toFixed(2)}
              </span>

              <div class="carrinho-acoes">

                <button
                  class="btn-menos"
                  onclick="alterarQuantidade(${i}, -1)">

                  −

                </button>

                <button
                  class="btn-mais"
                  onclick="alterarQuantidade(${i}, 1)">

                  +

                </button>

                <button
                  class="btn-remover"
                  onclick="removerItem(${i})">

                  🗑

                </button>

              </div>

            </div>

          </div>

        `).join("")}

      </div>

      <div class="carrinho-footer">

        <div class="total-box">

          <span>Total</span>

          <strong>
            R$ ${calcularTotal().toFixed(2)}
          </strong>

        </div>

        <div class="botoes-carrinho">

          <button
            class="btn-finalizar"
            onclick="finalizarPedido()">

            Finalizar Pedido

          </button>

          <button
            class="btn-cancelar"
            onclick="cancelarPedido()">

            Cancelar

          </button>

        </div>

      </div>

    </div>
  `;
}

/* =====================
   FECHAR CARRINHO
===================== */
function fecharCarrinho() {

  const popup =
    document.getElementById("carrinhoPopup");

  popup.style.display = "none";
}

/* =====================
   ATUALIZAÇÕES
===================== */
function atualizarCarrinho() {

  atualizarBarraCarrinho();

  const popup =
    document.getElementById("carrinhoPopup");

  if (
    popup &&
    (
      popup.style.display === "block" ||
      popup.style.display === "flex"
    )
  ) {

    popup.innerHTML = gerarHTMLCarrinho();

  }
}

/* =====================
   ALTERAR QUANTIDADE
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
   CANCELAR PEDIDO
===================== */
function cancelarPedido() {

  if (confirm("Deseja cancelar o pedido?")) {

    carrinho = [];

    atualizarCarrinho();
  }
}

/* =====================
   TOTAL
===================== */
function calcularTotal() {

  return carrinho.reduce(

    (soma, item) =>
      soma + item.preco * item.quantidade,

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

  localStorage.setItem(
    "carrinho",
    JSON.stringify(carrinho)
  );

  window.location.href = "checkout.html";
}