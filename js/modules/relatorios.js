import { formatarMoeda } from './utils.js';
import { pedidos } from './ui.js';

export function filtrarPedidosRelatorio(dataInicio, dataFim) {
    const pedidosFiltrados = pedidos.filter(pedido => {
        return pedido.dataPedido >= dataInicio && pedido.dataPedido <= dataFim;
    });

    gerarRelatorio(pedidosFiltrados);
}

export function gerarRelatorio(pedidosFiltrados) {
    let relatorio = '';
    let totalPedidos = 0;
    let totalFrete = 0;
    let totalLucro = 0;

    pedidosFiltrados.forEach(pedido => {
        totalPedidos += pedido.total;
        totalFrete += pedido.valorFrete;
        totalLucro += pedido.lucro;
    });

    relatorio += `<p>Total de Pedidos: ${formatarMoeda(totalPedidos)}</p>`;
    relatorio += `<p>Total de Frete: ${formatarMoeda(totalFrete)}</p>`;
    relatorio += `<p>Total de Lucro: ${formatarMoeda(totalLucro)}</p>`;

    document.getElementById('relatorio-conteudo').innerHTML = relatorio;
}

export function gerarRelatorioCSV() {
    let csv = 'Número do Pedido,Data do Pedido,Cliente,Total,Frete,Lucro\n';

    pedidos.forEach(pedido => {
        csv += `${pedido.numero},${pedido.dataPedido},${pedido.cliente},${pedido.total},${pedido.valorFrete},${pedido.lucro}\n`;
    });

    const hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'relatorio_pedidos.csv';
    hiddenElement.click();
}

export function inicializarRelatorios() {
    // Aqui você pode adicionar ouvintes de eventos específicos para a área de relatórios, se necessário.
}
