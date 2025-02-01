import { formatarMoeda } from './utils.js';

// Variáveis globais
export let orcamentos = [];
export let pedidos = [];
export let numeroOrcamento = 1;
export let numeroPedido = 1;
export const anoAtual = new Date().getFullYear();
export let orcamentoEditando = null;

export function mostrarPagina(idPagina) {
    const paginas = document.querySelectorAll('.pagina');
    paginas.forEach(pagina => {
        pagina.style.display = 'none';
    });

    document.getElementById(idPagina).style.display = 'block';
}

export function limparCamposMoeda() {
    const camposMoeda = ['valorFrete', 'valorOrcamento', 'total', 'entrada', 'restante', 'lucro',
                         'valorFreteEdicao', 'valorPedidoEdicao', 'totalEdicao', 'entradaEdicao', 'restanteEdicao', 'lucroEdicao'];
    camposMoeda.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            campo.value = '0,00';
        }
    });
}

export function salvarDados() {
    localStorage.setItem('orcamentos', JSON.stringify(orcamentos));
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    localStorage.setItem('numeroOrcamento', numeroOrcamento);
    localStorage.setItem('numeroPedido', numeroPedido);
}

export function carregarDados() {
    orcamentos = JSON.parse(localStorage.getItem('orcamentos')) || [];
    pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    numeroOrcamento = parseInt(localStorage.getItem('numeroOrcamento')) || 1;
    numeroPedido = parseInt(localStorage.getItem('numeroPedido')) || 1;
}

export function atualizarPainelUltimoBackup() {
    const ultimoBackup = JSON.parse(localStorage.getItem('ultimoBackup'));
    const painel = document.getElementById('ultimoBackup');

    if (ultimoBackup) {
        const data = new Date(ultimoBackup.data);
        const dataFormatada = `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}/${data.getFullYear()} ${data.getHours().toString().padStart(2, '0')}:${data.getMinutes().toString().padStart(2, '0')}`;

        painel.innerHTML = `Último backup: ${dataFormatada}`;
    } else {
        painel.innerHTML = 'Nenhum backup encontrado';
    }
}

export function limparPagina() {
  // Recarrega a página
  location.reload();
}
