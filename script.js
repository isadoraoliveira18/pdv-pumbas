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

/* =====================
   FINALIZAR PEDIDO
   ===================== */
function finalizarPedido() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  // Redireciona para checkout.html com dados do carrinho salvos no localStorage
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  window.location.href = "checkout.html";
}

/* =====================
   PÁGINA DE CHECKOUT
   ===================== */

   
document.addEventListener("DOMContentLoaded", () => {
  const resumo = document.getElementById("resumo");
  const listaCarrinho = document.getElementById("listaCarrinho");

  if (resumo && listaCarrinho) {
    const carrinhoSalvo = JSON.parse(localStorage.getItem("carrinho") || "[]");

    if (carrinhoSalvo.length === 0) {
      resumo.innerHTML = "<p>Nenhum item no pedido.</p>";
      return;
    }

    let total = 0;
    carrinhoSalvo.forEach(item => {
      total += item.preco * item.quantidade;
      const li = document.createElement("li");
      li.textContent = `${item.quantidade}x ${item.nome} - R$${(item.preco * item.quantidade).toFixed(2)}`;
      listaCarrinho.appendChild(li);
    });

    const totalEl = document.createElement("p");
    totalEl.classList.add("total");
    totalEl.innerHTML = `<strong>Total: R$${total.toFixed(2)}</strong>`;
    resumo.appendChild(totalEl);
  }
});

/* =====================
   ENTREGA / ENDEREÇO
   ===================== */
function mostrarEndereco() {
  const tipoEntrega = document.getElementById("tipoEntrega").value;
  const enderecoBox = document.getElementById("enderecoBox");
  enderecoBox.style.display = tipoEntrega === "entrega" ? "block" : "none";
}

/* =====================
   ENVIAR PEDIDO PELO WHATSAPP
   ===================== */
function enviarWhatsApp() {
  const carrinhoSalvo = JSON.parse(localStorage.getItem("carrinho") || "[]");
  if (carrinhoSalvo.length === 0) {
    alert("Seu pedido está vazio!");
    return;
  }

  const pagamento = document.getElementById("pagamento").value;
  const tipoEntrega = document.getElementById("tipoEntrega").value;
  const observacao = document.getElementById("observacao").value.trim();
  let endereco = "";

  if (tipoEntrega === "entrega") {
    endereco = document.getElementById("endereco").value.trim();
    if (!endereco) {
      alert("Por favor, insira o endereço de entrega.");
      return;
    }
  }

  const mensagem = carrinhoSalvo.map(item =>
    `${item.quantidade}x ${item.nome} - R$${(item.preco * item.quantidade).toFixed(2)}`
  ).join("%0A");

  const total = carrinhoSalvo.reduce((soma, item) => soma + item.preco * item.quantidade, 0).toFixed(2);

  let texto = `*Pumbas Burguer* 🍔%0A${mensagem}%0A%0A*Total:* R$${total}%0A💳 *Pagamento:* ${pagamento}%0A🚚 *Tipo:* ${tipoEntrega === "entrega" ? "Entrega" : "Retirada no Pumbas (Grátis)"}`;

  if (endereco) texto += `%0A📍 *Endereço:* ${endereco}`;
  if (observacao) texto += `%0A🗒️ *Observações:* ${observacao}`;

  texto += `%0A%0A⚠️ *O valor do frete será informado pelo atendente.*`;

  const numeroWhatsApp = "5575982183914";
  const url = `https://wa.me/${numeroWhatsApp}?text=${texto}`;
  window.open(url, "_blank");
}
