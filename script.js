let carrinho = [];

function addToCart(nome, preco) {
  const itemExistente = carrinho.find(item => item.nome === nome);
  if (itemExistente) {
    itemExistente.quantidade++;
  } else {
    carrinho.push({ nome, preco, quantidade: 1 });
  }
  atualizarCarrinho();
}

function atualizarCarrinho() {
  const carrinhoDiv = document.querySelector('.carrinho');
  if (!carrinhoDiv) return;

  carrinhoDiv.innerHTML = `
    <h2>🛒 Carrinho</h2>
    ${carrinho.length === 0
      ? "<p>Nenhum item adicionado.</p>"
      : carrinho.map((item, i) => `
        <div class="carrinho-item">
          <span>${item.nome} (${item.quantidade}x)</span>
          <div>
            <button onclick="alterarQuantidade(${i}, -1)">➖</button>
            <button onclick="alterarQuantidade(${i}, 1)">➕</button>
            <button onclick="removerItem(${i})">❌</button>
          </div>
        </div>
      `).join('')
    }
    <p class="total">Total: R$ ${calcularTotal().toFixed(2)}</p>
    <div class="botoes-carrinho">
      <button class="finalizar" onclick="finalizarPedido()">✅ Finalizar Pedido</button>
      <button class="cancelar" onclick="cancelarPedido()">❌ Cancelar</button>
    </div>
  `;
}

function alterarQuantidade(index, valor) {
  carrinho[index].quantidade += valor;
  if (carrinho[index].quantidade <= 0) carrinho.splice(index, 1);
  atualizarCarrinho();
}

function removerItem(index) {
  carrinho.splice(index, 1);
  atualizarCarrinho();
}

function calcularTotal() {
  return carrinho.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
}

function finalizarPedido() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  const mensagem = carrinho.map(item =>
    `${item.quantidade}x ${item.nome} - R$${(item.preco * item.quantidade).toFixed(2)}`
  ).join("%0A");

  const total = calcularTotal().toFixed(2);
  const texto = `*Pumbas Burguer* 🍔%0A${mensagem}%0A%0A*Total:* R$${total}`;

  const numeroWhatsApp = "5575982183914"; // coloque o seu número com DDI + DDD
  const url = `https://wa.me/${numeroWhatsApp}?text=${texto}`;
  window.open(url, "_blank");
}

function cancelarPedido() {
  if (confirm("Tem certeza que deseja cancelar o pedido?")) {
    carrinho = [];
    atualizarCarrinho();
  }
}
