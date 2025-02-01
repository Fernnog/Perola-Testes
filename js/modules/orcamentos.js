import { formatarMoeda, gerarNumeroFormatado } from './utils.js';
import { criarPedidoAPartirDeOrcamento } from './pedidos.js';
import { orcamentos, salvarDados, exportarDados, mostrarPagina, anoAtual, numeroOrcamento, orcamentoEditando, limparCamposMoeda } from './ui.js';

export function adicionarProduto() {
    const tbody = document.querySelector("#tabelaProdutos tbody");
    const newRow = tbody.insertRow();

    const cellQuantidade = newRow.insertCell();
    const cellDescricao = newRow.insertCell();
    const cellValorUnit = newRow.insertCell();
    const cellValorTotal = newRow.insertCell();

    cellQuantidade.innerHTML = '<input type="number" class="produto-quantidade" value="1" min="1" onchange="atualizarTotais()">';
    cellDescricao.innerHTML = '<input type="text" class="produto-descricao">';
    cellValorUnit.innerHTML = '<input type="text" class="produto-valor-unit" value="0,00" onblur="atualizarTotais()">';
    cellValorTotal.textContent = formatarMoeda(0);
}

export function atualizarTotais() {
    let valorTotalOrcamento = 0;
    const produtos = document.querySelectorAll("#tabelaProdutos tbody tr");

    produtos.forEach(row => {
        const quantidade = parseFloat(row.querySelector(".produto-quantidade").value);
        const valorUnitText = row.querySelector(".produto-valor-unit").value.replace("R$", "").replace(".", "").replace(",", ".");
        const valorUnit = parseFloat(valorUnitText) || 0;
        const valorTotal = quantidade * valorUnit;

        row.cells[3].textContent = formatarMoeda(valorTotal);
        valorTotalOrcamento += valorTotal;
    });

    const valorFreteText = document.getElementById("valorFrete").value.replace("R$", "").replace(".", "").replace(",", ".");
    const valorFrete = parseFloat(valorFreteText) || 0;
    const total = valorTotalOrcamento + valorFrete;

    document.getElementById("valorOrcamento").value = formatarMoeda(valorTotalOrcamento);
    document.getElementById("total").value = formatarMoeda(total);
}

export function gerarOrcamento() {
    if (orcamentoEditando !== null) {
        alert("Você está no modo de edição de orçamento. Clique em 'Atualizar Orçamento' para salvar as alterações.");
        return;
    }

    const orcamento = {
        numero: gerarNumeroFormatado(numeroOrcamento),
        dataOrcamento: document.getElementById("dataOrcamento").value,
        dataValidade: document.getElementById("dataValidade").value,
        cliente: document.getElementById("cliente").value,
        endereco: document.getElementById("endereco").value,
        tema: document.getElementById("tema").value,
        cidade: document.getElementById("cidade").value,
        telefone: document.getElementById("telefone").value,
        email: document.getElementById("email").value,
        cores: document.getElementById("cores").value,
        produtos: [],
        pagamento: Array.from(document.querySelectorAll('input[name="pagamento"]:checked')).map(el => el.value),
        valorFrete: parseFloat(document.getElementById("valorFrete").value.replace(/[^\d,]/g, '').replace(',', '.')),
        valorOrcamento: parseFloat(document.getElementById("valorOrcamento").value.replace(/[^\d,]/g, '').replace(',', '.')),
        total: parseFloat(document.getElementById("total").value.replace(/[^\d,]/g, '').replace(',', '.')),
        observacoes: document.getElementById("observacoes").value,
        pedidoGerado: false,
        numeroPedido: null
    };

    const produtos = document.querySelectorAll("#tabelaProdutos tbody tr");
    produtos.forEach(row => {
        orcamento.produtos.push({
            quantidade: parseFloat(row.querySelector(".produto-quantidade").value),
            descricao: row.querySelector(".produto-descricao").value,
            valorUnit: parseFloat(row.querySelector(".produto-valor-unit").value.replace(/[^\d,]/g, '').replace(',', '.')),
            valorTotal: parseFloat(row.cells[3].textContent.replace(/[^\d,]/g, '').replace(',', '.'))
        });
    });

    orcamentos.push(orcamento);
    numeroOrcamento++;
    
    exibirOrcamentoEmHTML(orcamento);
    exportarDados();
    salvarDados();

    document.getElementById("orcamento").reset();
    limparCamposMoeda();
    document.querySelector("#tabelaProdutos tbody").innerHTML = "";

    alert("Orçamento gerado com sucesso!");
}

export function exibirOrcamentoEmHTML(orcamento) {
    const janelaOrcamento = window.open('orcamento.html', '_blank');

    janelaOrcamento.addEventListener('load', () => {
        const conteudoOrcamento = janelaOrcamento.document.getElementById("conteudo-orcamento");

        let html = `
            <h2>Orçamento Nº ${orcamento.numero}</h2>
            <div class="info-orcamento">
                <strong>Data do Orçamento:</strong> ${orcamento.dataOrcamento}<br>
                <strong>Data de Validade:</strong> ${orcamento.dataValidade}<br>
                <strong>Cliente:</strong> ${orcamento.cliente}<br>
                <strong>Endereço:</strong> ${orcamento.endereco}<br>
                <strong>Cidade:</strong> ${orcamento.cidade}<br>
                <strong>Telefone:</strong> ${orcamento.telefone}<br>
                <strong>E-mail:</strong> ${orcamento.email}<br>
                ${orcamento.tema ? `<strong>Tema:</strong> ${orcamento.tema}<br>` : ''}
                ${orcamento.cores ? `<strong>Cores:</strong> ${orcamento.cores}<br>` : ''}
            </div>
            <h3>Produtos</h3>
            <table>
                <thead>
                    <tr>
                        <th>Quantidade</th>
                        <th>Descrição do Produto</th>
                        <th>Valor Unit.</th>
                        <th>Valor Total</th>
                    </tr>
                </thead>
                <tbody>
        `;

        orcamento.produtos.forEach(produto => {
            html += `
                <tr>
                    <td>${produto.quantidade}</td>
                    <td>${produto.descricao}</td>
                    <td>${formatarMoeda(produto.valorUnit)}</td>
                    <td>${formatarMoeda(produto.valorTotal)}</td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
            <div class="info-orcamento">
                <strong>Pagamento:</strong> ${orcamento.pagamento.join(', ')}<br>
                <strong>Valor do Frete:</strong> ${formatarMoeda(orcamento.valorFrete)}<br>
                <strong>Valor do Orçamento:</strong> ${formatarMoeda(orcamento.valorOrcamento)}<br>
                <strong>Total:</strong> ${formatarMoeda(orcamento.total)}<br>
                ${orcamento.observacoes ? `<strong>Observações:</strong> ${orcamento.observacoes}<br>` : ''}
            </div>
        `;

        conteudoOrcamento.innerHTML = html;
    });
}

export function mostrarOrcamentosGerados() {
    const tbody = document.querySelector("#tabela-orcamentos tbody");
    tbody.innerHTML = '';

    orcamentos.forEach(orcamento => {
        const row = tbody.insertRow();
        const cellNumero = row.insertCell();
        const cellData = row.insertCell();
        const cellCliente = row.insertCell();
        const cellTotal = row.insertCell();
        const cellNumeroPedido = row.insertCell();
        const cellAcoes = row.insertCell();

        cellNumero.textContent = orcamento.numero;
        cellData.textContent = orcamento.dataOrcamento;
        cellCliente.textContent = orcamento.cliente;
        cellTotal.textContent = formatarMoeda(orcamento.total);
        cellNumeroPedido.textContent = orcamento.numeroPedido || 'N/A';

        if (orcamento.pedidoGerado) {
            cellAcoes.innerHTML = `<button type="button" onclick="exibirOrcamentoEmHTML(orcamentos.find(o => o.numero === '${orcamento.numero}'))">Visualizar</button>`;
        } else {
            cellAcoes.innerHTML = `<button type="button" onclick="editarOrcamento('${orcamento.numero}')">Editar</button>
                                   <button type="button" onclick="exibirOrcamentoEmHTML(orcamentos.find(o => o.numero === '${orcamento.numero}'))">Visualizar</button>
                                   <button type="button" onclick="gerarPedido('${orcamento.numero}')">Gerar Pedido</button>`;
        }
    });
}

export function filtrarOrcamentos() {
    const dataInicio = document.getElementById('filtroDataInicioOrcamento').value;
    const dataFim = document.getElementById('filtroDataFimOrcamento').value;
    const numeroOrcamentoFiltro = parseInt(document.getElementById('filtroNumeroOrcamento').value);
    const anoOrcamentoFiltro = parseInt(document.getElementById('filtroAnoOrcamento').value);
    const clienteOrcamentoFiltro = document.getElementById('filtroClienteOrcamento').value.toLowerCase();

    const orcamentosFiltrados = orcamentos.filter(orcamento => {
        const [numOrcamento, anoOrcamento] = orcamento.numero.split('/');
        const dataOrcamento = new Date(orcamento.dataOrcamento);
        const nomeCliente = orcamento.cliente.toLowerCase();

        return (!dataInicio || dataOrcamento >= new Date(dataInicio)) &&
               (!dataFim || dataOrcamento <= new Date(dataFim)) &&
               (!numeroOrcamentoFiltro || parseInt(numOrcamento) === numeroOrcamentoFiltro) &&
               (!anoOrcamentoFiltro || parseInt(anoOrcamento) === anoOrcamentoFiltro) &&
               nomeCliente.includes(clienteOrcamentoFiltro);
    });

    atualizarListaOrcamentos(orcamentosFiltrados);
}

function atualizarListaOrcamentos(orcamentosFiltrados) {
    const tbody = document.querySelector("#tabela-orcamentos tbody");
    tbody.innerHTML = '';

    orcamentosFiltrados.forEach(orcamento => {
        const row = tbody.insertRow();
        const cellNumero = row.insertCell();
        const cellData = row.insertCell();
        const cellCliente = row.insertCell();
        const cellTotal = row.insertCell();
        const cellNumeroPedido = row.insertCell();
        const cellAcoes = row.insertCell();

        cellNumero.textContent = orcamento.numero;
        cellData.textContent = orcamento.dataOrcamento;
        cellCliente.textContent = orcamento.cliente;
        cellTotal.textContent = formatarMoeda(orcamento.total);
        cellNumeroPedido.textContent = orcamento.numeroPedido || 'N/A';

        if (orcamento.pedidoGerado) {
            cellAcoes.innerHTML = `<button type="button" onclick="exibirOrcamentoEmHTML(orcamentos.find(o => o.numero === '${orcamento.numero}'))">Visualizar</button>`;
        } else {
            cellAcoes.innerHTML = `<button type="button" onclick="editarOrcamento('${orcamento.numero}')">Editar</button>
                                   <button type="button" onclick="exibirOrcamentoEmHTML(orcamentos.find(o => o.numero === '${orcamento.numero}'))">Visualizar</button>
                                   <button type="button" onclick="gerarPedido('${orcamento.numero}')">Gerar Pedido</button>`;
        }
    });
}

export function editarOrcamento(numeroOrcamento) {
    const orcamento = orcamentos.find(o => o.numero === numeroOrcamento);
    if (!orcamento) {
        alert("Orçamento não encontrado.");
        return;
    }

    if (orcamento.pedidoGerado) {
        alert("Não é possível editar um orçamento que já gerou um pedido.");
        return;
    }

    orcamentoEditando = orcamento.numero;

    document.getElementById("dataOrcamento").value = orcamento.dataOrcamento;
    document.getElementById("dataValidade").value = orcamento.dataValidade;
    document.getElementById("cliente").value = orcamento.cliente;
    document.getElementById("endereco").value = orcamento.endereco;
    document.getElementById("tema").value = orcamento.tema;
    document.getElementById("cidade").value = orcamento.cidade;
    document.getElementById("telefone").value = orcamento.telefone;
    document.getElementById("email").value = orcamento.email;
    document.getElementById("cores").value = orcamento.cores;
    document.getElementById("valorFrete").value = formatarMoeda(orcamento.valorFrete);
    document.getElementById("valorOrcamento").value = formatarMoeda(orcamento.valorOrcamento);
    document.getElementById("total").value = formatarMoeda(orcamento.total);
    document.getElementById("observacoes").value = orcamento.observacoes;

    const tbody = document.querySelector("#tabelaProdutos tbody");
    tbody.innerHTML = '';
    orcamento.produtos.forEach(produto => {
        const row = tbody.insertRow();
        const cellQuantidade = row.insertCell();
        const cellDescricao = row.insertCell();
        const cellValorUnit = row.insertCell();
        const cellValorTotal = row.insertCell();

        cellQuantidade.innerHTML = `<input type="number" class="produto-quantidade" value="${produto.quantidade}" min="1" onchange="atualizarTotais()">`;
        cellDescricao.innerHTML = `<input type="text" class="produto-descricao" value="${produto.descricao}">`;
        cellValorUnit.innerHTML = `<input type="text" class="produto-valor-unit" value="${formatarMoeda(produto.valorUnit)}" oninput="formatarEntradaMoeda(this)" onblur="atualizarTotais()">`;
        cellValorTotal.textContent = formatarMoeda(produto.valorTotal);
    });

    document.querySelectorAll('input[name="pagamento"]').forEach(el => {
        el.checked = orcamento.pagamento.includes(el.value);
    });

    mostrarPagina('form-orcamento');
    document.getElementById("btnGerarOrcamento").style.display = "none";
    document.getElementById("btnAtualizarOrcamento").style.display = "inline-block";
}

export function atualizarOrcamento() {
    if (orcamentoEditando === null) {
        alert("Nenhum orçamento está sendo editado.");
        return;
    }

    const orcamentoIndex = orcamentos.findIndex(o => o.numero === orcamentoEditando);
    if (orcamentoIndex === -1) {
        alert("Orçamento não encontrado.");
        return;
    }

    orcamentos[orcamentoIndex] = {
        ...orcamentos[orcamentoIndex],
        dataOrcamento: document.getElementById("dataOrcamento").value,
        dataValidade: document.getElementById("dataValidade").value,
        cliente: document.getElementById("cliente").value,
        endereco: document.getElementById("endereco").value,
        tema: document.getElementById("tema").value,
        cidade: document.getElementById("cidade").value,
        telefone: document.getElementById("telefone").value,
        email: document.getElementById("email").value,
        cores: document.getElementById("cores").value,
        produtos: [],
        pagamento: Array.from(document.querySelectorAll('input[name="pagamento"]:checked')).map(el => el.value),
        valorFrete: parseFloat(document.getElementById("valorFrete").value.replace(/[^\d,]/g, '').replace(',', '.')),
        valorOrcamento: parseFloat(document.getElementById("valorOrcamento").value.replace(/[^\d,]/g, '').replace(',', '.')),
        total: parseFloat(document.getElementById("total").value.replace(/[^\d,]/g, '').replace(',', '.')),
        observacoes: document.getElementById("observacoes").value,
    };

    const produtos = document.querySelectorAll("#tabelaProdutos tbody tr");
    produtos.forEach(row => {
        orcamentos[orcamentoIndex].produtos.push({
            quantidade: parseFloat(row.querySelector(".produto-quantidade").value),
            descricao: row.querySelector(".produto-descricao").value,
            valorUnit: parseFloat(row.querySelector(".produto-valor-unit").value.replace(/[^\d,]/g, '').replace(',', '.')),
            valorTotal: parseFloat(row.cells[3].textContent.replace(/[^\d,]/g, '').replace(',', '.'))
        });
    });

    exportarDados();
    salvarDados();

    document.getElementById("orcamento").reset();
    limparCamposMoeda();
    document.querySelector("#tabelaProdutos tbody").innerHTML = "";

    alert("Orçamento atualizado com sucesso!");

    orcamentoEditando = null;
    document.getElementById("btnGerarOrcamento").style.display = "inline-block";
    document.getElementById("btnAtualizarOrcamento").style.display = "none";

    mostrarPagina('orcamentos-gerados');
    mostrarOrcamentosGerados();
}

export function gerarPedido(numeroOrcamento) {
    const orcamento = orcamentos.find(o => o.numero === numeroOrcamento);
    if (!orcamento) {
        alert("Orçamento não encontrado.");
        return;
    }

    if (orcamento.pedidoGerado) {
        alert("Um pedido já foi gerado para este orçamento.");
        return;
    }

    criarPedidoAPartirDeOrcamento(orcamento);
}

export function inicializarOrcamentos() {
    // Aqui você pode adicionar ouvintes de eventos específicos para a área de orçamentos, se necessário.
    // Por exemplo, ouvintes de eventos para os botões de ação na tabela de orçamentos gerados.
}
