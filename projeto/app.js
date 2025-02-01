import { inicializarOrcamentos, gerarOrcamento, mostrarOrcamentosGerados, filtrarOrcamentos, editarOrcamento, atualizarOrcamento, adicionarProduto, atualizarTotais, exibirOrcamentoEmHTML } from './modules/orcamentos.js';
import { inicializarPedidos, mostrarPedidosRealizados, filtrarPedidos, adicionarProdutoEdicao, atualizarTotaisEdicao, atualizarRestanteEdicao, editarPedido, atualizarPedido } from './modules/pedidos.js';
import { inicializarRelatorios, filtrarPedidosRelatorio, gerarRelatorioCSV } from './modules/relatorios.js';
import { inicializarBackup, importarDados, exportarDados } from './modules/backup.js';
import { carregarDados, mostrarPagina, atualizarPainelUltimoBackup, limparCamposMoeda, orcamentos, numeroOrcamento, anoAtual, orcamentoEditando } from './modules/ui.js';

document.addEventListener('DOMContentLoaded', () => {
    carregarDados();
    inicializarOrcamentos();
    inicializarPedidos();
    inicializarRelatorios();
    inicializarBackup();
    mostrarPagina('form-orcamento');
    atualizarPainelUltimoBackup();

    // Vincular as funções aos eventos dos elementos do DOM, isso foi feito aqui no app.js para uma melhor organização.
    // elementos do menu
    const linkOrcamento = document.querySelector('nav ul li:nth-child(1) a');
    const linkOrcamentosGerados = document.querySelector('nav ul li:nth-child(2) a');
    const linkPedidosRealizados = document.querySelector('nav ul li:nth-child(3) a');
    const linkRelatorios = document.querySelector('nav ul li:nth-child(4) a');
    const linkImportarExportar = document.querySelector('nav ul li:nth-child(5) a');
    const linkLimparPagina = document.querySelector('nav ul li:nth-child(6) a');

    if (linkOrcamento) {
      linkOrcamento.addEventListener('click', (event) => {
        event.preventDefault();
        mostrarPagina('form-orcamento');
      });
    }

    if (linkOrcamentosGerados) {
      linkOrcamentosGerados.addEventListener('click', (event) => {
        event.preventDefault();
        mostrarPagina('orcamentos-gerados');
        mostrarOrcamentosGerados();
      });
    }

    if (linkPedidosRealizados) {
      linkPedidosRealizados.addEventListener('click', (event) => {
        event.preventDefault();
        mostrarPagina('lista-pedidos');
        mostrarPedidosRealizados();
      });
    }
    
    if (linkRelatorios) {
      linkRelatorios.addEventListener('click', (event) => {
        event.preventDefault();
        mostrarPagina('relatorio');
      });
    }

    if (linkImportarExportar) {
      linkImportarExportar.addEventListener('click', (event) => {
        event.preventDefault();
        mostrarPagina('backup');
      });
    }

    if (linkLimparPagina) {
      linkLimparPagina.addEventListener('click', (event) => {
        event.preventDefault();
        limparPagina();
      });
    }
    
    // Orcamentos
    const btnAdicionarProduto = document.querySelector("#tabelaProdutos + button");
    if (btnAdicionarProduto) {
        btnAdicionarProduto.addEventListener('click', adicionarProduto);
    }
    
    const formOrcamento = document.getElementById("orcamento");
    if (formOrcamento) {
      formOrcamento.addEventListener("submit", (event) => {
        event.preventDefault();
        if (orcamentoEditando === null) {
          gerarOrcamento();
        } else {
          atualizarOrcamento();
        }
      });
    }
    
    const btnGerarOrcamento = document.getElementById("btnGerarOrcamento");
    if (btnGerarOrcamento) {
      btnGerarOrcamento.addEventListener("click", (event) => {
        event.preventDefault();
        gerarOrcamento();
      });
    }
    
    const btnAtualizarOrcamento = document.getElementById("btnAtualizarOrcamento");
    if (btnAtualizarOrcamento) {
      btnAtualizarOrcamento.addEventListener("click", (event) => {
        event.preventDefault();
        atualizarOrcamento();
      });
    }

    const filtroDataInicioOrcamento = document.getElementById('filtroDataInicioOrcamento');
    const filtroDataFimOrcamento = document.getElementById('filtroDataFimOrcamento');
    const filtroNumeroOrcamento = document.getElementById('filtroNumeroOrcamento');
    const filtroAnoOrcamento = document.getElementById('filtroAnoOrcamento');
    const filtroClienteOrcamento = document.getElementById('filtroClienteOrcamento');
    const btnFiltrarOrcamentos = document.querySelector('#orcamentos-gerados .filtro-data button');
    
    if (btnFiltrarOrcamentos) {
      btnFiltrarOrcamentos.addEventListener('click', () => {
        filtrarOrcamentos(
          filtroDataInicioOrcamento.value,
          filtroDataFimOrcamento.value,
          filtroNumeroOrcamento.value ? parseInt(filtroNumeroOrcamento.value) : null,
          filtroAnoOrcamento.value ? parseInt(filtroAnoOrcamento.value) : null,
          filtroClienteOrcamento.value
        );
      });
    }
    
    // Pedidos
    const btnAdicionarProdutoEdicao = document.querySelector("#tabelaProdutosEdicao + button");
    if (btnAdicionarProdutoEdicao) {
        btnAdicionarProdutoEdicao.addEventListener('click', adicionarProdutoEdicao);
    }

    const filtroDataInicioPedido = document.getElementById('filtroDataInicioPedido');
    const filtroDataFimPedido = document.getElementById('filtroDataFimPedido');
    const filtroNumeroPedido = document.getElementById('filtroNumeroPedido');
    const filtroAnoPedido = document.getElementById('filtroAnoPedido');
    const filtroClientePedido = document.getElementById('filtroClientePedido');
    const btnFiltrarPedidos = document.querySelector('#lista-pedidos .filtro-data button');

    if (btnFiltrarPedidos) {
      btnFiltrarPedidos.addEventListener('click', () => {
        filtrarPedidos(
          filtroDataInicioPedido.value,
          filtroDataFimPedido.value,
          filtroNumeroPedido.value ? parseInt(filtroNumeroPedido.value) : null,
          filtroAnoPedido.value ? parseInt(filtroAnoPedido.value) : null,
          filtroClientePedido.value
        );
      });
    }
    
    // Relatorios
    const filtroDataInicio = document.getElementById('filtroDataInicio');
    const filtroDataFim = document.getElementById('filtroDataFim');
    const btnFiltrar = document.querySelector('#relatorio .filtro-data button');
    const btnExportarCSV = document.querySelector('#relatorio button:last-of-type');
    
    if (btnFiltrar) {
      btnFiltrar.addEventListener('click', () => filtrarPedidosRelatorio(filtroDataInicio.value, filtroDataFim.value));
    }

    if (btnExportarCSV) {
      btnExportarCSV.addEventListener('click', gerarRelatorioCSV);
    }
    
    // Backup
    const inputImportar = document.getElementById('inputImportar');
    const btnImportar = document.querySelector('#backup button:first-of-type');
    const btnExportar = document.querySelector('#backup button:last-of-type');

    if (btnImportar) {
      btnImportar.addEventListener('click', () => importarDados(inputImportar));
    }
    
    if (btnExportar) {
      btnExportar.addEventListener('click', exportarDados);
    }
    
});
